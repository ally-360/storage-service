import path from 'path';
import * as fs from 'fs';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'minio';
import {
  FileMetadata,
  UploadResult,
  DownloadResult,
  BucketStats,
  ListFilesResult,
  FileVersion,
  MinioConfig,
} from './dtos';
import { getMimeType } from './helpers/get-mimetype.helper';
import { StorageInterface } from './interfaces/storage.interface';

@Injectable()
export class MinioAdapter implements StorageInterface {
  private readonly logger = new Logger(MinioAdapter.name);
  private readonly configMinio: MinioConfig;

  private storage: Client;
  private bucket: string;

  constructor(private readonly config: ConfigService) {
    const storageConfig = this.config.get<MinioConfig>('storage');
    if (!storageConfig) {
      this.logger.error('Storage configuration not found');
      throw new InternalServerErrorException('Storage configuration not found');
    }
    this.configMinio = storageConfig;

    this.storage = new Client({
      endPoint: this.configMinio.apiEndpoint,
      port: this.configMinio.port,
      accessKey: this.configMinio.accessKey,
      secretKey: this.configMinio.secretKey,
      useSSL: this.configMinio.useSSL,
    });

    void this.initializeClient();
  }

  /**
   * Inicializa el cliente de MinIO
   */
  private async initializeClient(): Promise<void> {
    this.bucket = this.configMinio.bucketName;
    const exists = await this.storage.bucketExists(this.bucket);

    if (!exists) {
      try {
        await this.storage.makeBucket(this.bucket);

        const localFolder = path.join(process.cwd(), 'storage', 'tenant-id');
        this.uploadFilesToMinio(localFolder);
      } catch (error) {
        this.logger.error('MinIO error ' + error);
      }
    }

    this.logger.log('MinIO client initialized successfully');
  }

  /**
   * Verifica si el bucket existe, si no lo crea
   */
  async ensureBucketExists(bucketName?: string): Promise<boolean> {
    try {
      const bucket = bucketName || this.configMinio.bucketName;
      this.logger.log(`Ensuring bucket ${bucket} exists`);

      const exists = await this.storage.bucketExists(bucket);
      if (!exists) {
        await this.storage.makeBucket(bucket);
        this.logger.log(`Bucket ${bucket} created successfully`);
      }

      return true;
    } catch (error) {
      this.logger.error(`Error ensuring bucket exists: ${error}`);
      throw new InternalServerErrorException(
        `Failed to ensure bucket exists: ${error}`,
      );
    }
  }

  /**
   * Sube un archivo a MinIO
   */
  async uploadFile(
    file: Buffer,
    filename: string,
    bucket?: string,
    metadata?: Record<string, any>,
  ): Promise<UploadResult> {
    try {
      const targetBucket = bucket || this.configMinio.bucketName;
      this.logger.log(`Uploading file: ${filename} to bucket: ${targetBucket}`);

      // Asegurar que el bucket existe
      await this.ensureBucketExists(targetBucket);

      // Generar key única para el archivo
      const key = `${Date.now()}-${filename}`;

      // Subir archivo a MinIO
      const result = await this.storage.putObject(
        targetBucket,
        key,
        file,
        file.length,
        {
          'Content-Type': getMimeType(filename),
          ...metadata,
        },
      );

      // Crear metadatos del archivo
      const fileMetadata: FileMetadata = {
        filename,
        originalName: filename,
        mimetype: getMimeType(filename),
        size: file.length,
        bucket: targetBucket,
        key,
        etag: result.etag,
      };

      const uploadResult: UploadResult = {
        success: true,
        bucket: targetBucket,
        key,
        etag: result.etag,
        metadata: fileMetadata,
      };

      this.logger.log(`File uploaded successfully: ${key}`);
      return uploadResult;
    } catch (error) {
      this.logger.error(`Error uploading file: ${error}`);
      throw new InternalServerErrorException(`Failed to upload file: ${error}`);
    }
  }

  /**
   * Descarga un archivo desde MinIO
   */
  async downloadFile(
    key: string,
    bucket?: string,
    versionId?: string,
  ): Promise<DownloadResult> {
    try {
      const targetBucket = bucket || this.configMinio.bucketName;
      this.logger.log(`Downloading file: ${key} from bucket: ${targetBucket}`);

      // Verificar que el archivo existe
      const exists = await this.fileExists(key, targetBucket, versionId);
      if (!exists) {
        throw new NotFoundException(
          `File ${key} not found in bucket ${targetBucket}`,
        );
      }

      // Obtener el objeto de MinIO
      const stream = await this.storage.getObject(targetBucket, key, {
        versionId,
      });

      // Convertir stream a Buffer
      const chunks: Buffer[] = [];
      return new Promise((resolve, reject) => {
        stream.on('data', (chunk) => chunks.push(chunk));
        stream.on('end', () => {
          try {
            const data = Buffer.concat(chunks);

            // Obtener metadatos del archivo
            this.getFileMetadata(key, targetBucket, versionId)
              .then((metadata) => {
                const result: DownloadResult = {
                  success: true,
                  data,
                  metadata,
                  stream,
                };

                resolve(result);
              })
              .catch((error) => {
                this.logger.error(`Error downloading file: ${error}`);
                reject(
                  error instanceof Error ? error : new Error(String(error)),
                );
              });
          } catch (error) {
            this.logger.error(`Error downloading file: ${error}`);
            reject(error instanceof Error ? error : new Error(String(error)));
          }
        });
        stream.on('error', reject);
      });
    } catch (error) {
      this.logger.error(`Error downloading file: ${error}`);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to download file: ${error}`,
      );
    }
  }

  /**
   * Elimina un archivo de MinIO
   */
  async deleteFile(
    key: string,
    bucket?: string,
    versionId?: string,
  ): Promise<boolean> {
    try {
      const targetBucket = bucket || this.configMinio.bucketName;
      this.logger.log(`Deleting file: ${key} from bucket: ${targetBucket}`);

      // Verificar que el archivo existe
      const exists = await this.fileExists(key, targetBucket, versionId);
      if (!exists) {
        this.logger.warn(
          `File ${key} not found in bucket ${targetBucket}, nothing to delete`,
        );
        return true;
      }

      // Eliminar archivo de MinIO
      if (versionId) {
        await this.storage.removeObject(targetBucket, key, { versionId });
      } else {
        await this.storage.removeObject(targetBucket, key);
      }

      this.logger.log(`File ${key} deleted successfully`);
      return true;
    } catch (error) {
      this.logger.error(`Error deleting file: ${error}`);
      throw new InternalServerErrorException(`Failed to delete file: ${error}`);
    }
  }

  /**
   * Copia un archivo dentro del mismo bucket o entre buckets
   */
  async copyFile(
    sourceKey: string,
    destinationKey: string,
    sourceBucket?: string,
    destinationBucket?: string,
  ): Promise<boolean> {
    try {
      const source = sourceBucket || this.configMinio.bucketName;
      const destination = destinationBucket || this.configMinio.bucketName;
      this.logger.log(
        `Copying file from ${sourceKey} (${source}) to ${destinationKey} (${destination})`,
      );

      // Verificar que el archivo fuente existe
      const exists = await this.fileExists(sourceKey, source);
      if (!exists) {
        throw new NotFoundException(
          `Source file ${sourceKey} not found in bucket ${source}`,
        );
      }

      // Asegurar que el bucket destino existe
      await this.ensureBucketExists(destination);

      // Copiar archivo usando MinIO
      await this.storage.copyObject(
        destination,
        destinationKey,
        `${source}/${sourceKey}`,
      );

      this.logger.log(
        `File copied successfully from ${sourceKey} to ${destinationKey}`,
      );
      return true;
    } catch (error) {
      this.logger.error(`Error copying file: ${error}`);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to copy file: ${error}`);
    }
  }

  /**
   * Obtiene metadatos de un archivo
   */
  async getFileMetadata(
    key: string,
    bucket?: string,
    versionId?: string,
  ): Promise<FileMetadata> {
    try {
      const targetBucket = bucket || this.configMinio.bucketName;
      this.logger.log(
        `Getting metadata for file: ${key} from bucket: ${targetBucket}`,
      );

      // Obtener estadísticas del objeto de MinIO
      const stat = await this.storage.statObject(
        targetBucket,
        key,
        versionId ? { versionId } : undefined,
      );

      // Extraer nombre del archivo de la key
      const filename = key.split('/').pop() || key;

      const metadata: FileMetadata = {
        filename,
        originalName: filename,
        mimetype: stat.metaData?.['content-type'] || 'application/octet-stream',
        size: stat.size,
        bucket: targetBucket,
        key,
        etag: stat.etag,
        versionId: stat.versionId || undefined,
      };

      return metadata;
    } catch (error) {
      this.logger.error(`Error getting file metadata: ${error}`);
      throw new InternalServerErrorException(
        `Failed to get file metadata: ${error}`,
      );
    }
  }

  /**
   * Genera URL de acceso temporal (presigned URL)
   */
  async generatePresignedUrl(
    key: string,
    operation: 'GET' | 'PUT' | 'POST',
    expiresIn: number,
    bucket?: string,
  ): Promise<string> {
    try {
      const targetBucket = bucket || this.configMinio.bucketName;
      this.logger.log(
        `Generating presigned URL for: ${key} in bucket: ${targetBucket}`,
      );
      this.logger.log(
        `Operation: ${operation}, Expires in: ${expiresIn} seconds`,
      );

      // Verificar que el archivo existe para operaciones GET
      if (operation === 'GET') {
        const exists = await this.fileExists(key, targetBucket);
        if (!exists) {
          throw new NotFoundException(
            `File ${key} not found in bucket ${targetBucket}`,
          );
        }
      }

      let presignedUrl: string;

      switch (operation) {
        case 'GET':
          presignedUrl = await this.storage.presignedGetObject(
            targetBucket,
            key,
            expiresIn,
          );
          break;
        case 'PUT':
          presignedUrl = await this.storage.presignedPutObject(
            targetBucket,
            key,
            expiresIn,
          );
          break;
        case 'POST':
          // MinIO no soporta presigned POST policies de la misma manera que S3
          // Generamos una URL PUT como alternativa
          this.logger.warn(
            'POST presigned URLs not supported in MinIO, using PUT instead',
          );
          presignedUrl = await this.storage.presignedPutObject(
            targetBucket,
            key,
            expiresIn,
          );
          break;
        default:
          throw new Error(`Unsupported operation: ${operation as string}`);
      }

      this.logger.log(
        `Presigned URL generated successfully for ${operation} operation`,
      );
      return presignedUrl;
    } catch (error) {
      this.logger.error(`Error generating presigned URL: ${error}`);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to generate presigned URL: ${error}`,
      );
    }
  }

  /**
   * Lista archivos en un bucket con paginación
   */
  async listFiles(
    bucket?: string,
    prefix?: string,
    maxKeys?: number,
    continuationToken?: string,
  ): Promise<ListFilesResult> {
    try {
      const targetBucket = bucket || this.configMinio.bucketName;
      this.logger.log(`Listing files in bucket: ${targetBucket}`);
      if (prefix) this.logger.log(`Prefix: ${prefix}`);
      if (maxKeys) this.logger.log(`Max keys: ${maxKeys}`);
      if (continuationToken)
        this.logger.log(`Continuation token: ${continuationToken}`);

      // Listar objetos en MinIO
      const stream = this.storage.listObjects(targetBucket, prefix, true);

      const files: FileMetadata[] = [];
      let nextContinuationToken: string | undefined;
      let isTruncated = false;
      let count = 0;

      return new Promise((resolve, reject) => {
        stream.on('data', (obj) => {
          if (maxKeys && count >= maxKeys) {
            isTruncated = true;
            nextContinuationToken = obj.name || '';
            stream.destroy();
            return;
          }

          if (obj.name) {
            const metadata: FileMetadata = {
              filename: obj.name.split('/').pop() || obj.name,
              originalName: obj.name,
              mimetype: 'application/octet-stream',
              size: obj.size || 0,
              bucket: targetBucket,
              key: obj.name,
              etag: obj.etag || '',
            };

            files.push(metadata);
            count++;
          }
        });

        stream.on('end', () => {
          const result: ListFilesResult = {
            files,
            nextContinuationToken,
            isTruncated,
          };
          resolve(result);
        });

        stream.on('error', reject);
      });
    } catch (error) {
      this.logger.error(`Error listing files: ${error}`);
      throw new InternalServerErrorException(`Failed to list files: ${error}`);
    }
  }

  /**
   * Verifica si un archivo existe
   */
  async fileExists(
    key: string,
    bucket?: string,
    versionId?: string,
  ): Promise<boolean> {
    try {
      const targetBucket = bucket || this.configMinio.bucketName;
      this.logger.log(
        `Checking if file exists: ${key} in bucket: ${targetBucket}`,
      );
      if (versionId) {
        this.logger.log(`Version ID: ${versionId}`);
      }

      // Intentar obtener estadísticas del objeto
      await this.storage.statObject(
        targetBucket,
        key,
        versionId ? { versionId } : undefined,
      );
      return true;
    } catch (error) {
      // Si el error es 404 (NoSuchKey), el archivo no existe
      if (error.code === 'NoSuchKey' || error.statusCode === 404) {
        return false;
      }
      // Para otros errores, loggear y re-lanzar
      this.logger.error(`Error checking file existence: ${error}`);
      throw new InternalServerErrorException(
        `Failed to check file existence: ${error}`,
      );
    }
  }

  /**
   * Obtiene el tamaño de un archivo
   */
  async getFileSize(
    key: string,
    bucket?: string,
    versionId?: string,
  ): Promise<number> {
    try {
      const targetBucket = bucket || this.configMinio.bucketName;
      this.logger.log(
        `Getting file size for: ${key} in bucket: ${targetBucket}`,
      );
      if (versionId) {
        this.logger.log(`Version ID: ${versionId}`);
      }

      // Obtener estadísticas del objeto
      const stat = await this.storage.statObject(
        targetBucket,
        key,
        versionId ? { versionId } : undefined,
      );
      return stat.size;
    } catch (error) {
      this.logger.error(`Error getting file size: ${error}`);
      throw new InternalServerErrorException(
        `Failed to get file size: ${error}`,
      );
    }
  }

  /**
   * Obtiene estadísticas del bucket
   */
  async getBucketStats(bucket?: string): Promise<BucketStats> {
    try {
      const targetBucket = bucket || this.configMinio.bucketName;
      this.logger.log(`Getting stats for bucket: ${targetBucket}`);

      // Listar todos los objetos para obtener estadísticas
      const stream = this.storage.listObjects(targetBucket, '', true);

      let totalFiles = 0;
      let totalSize = 0;
      let lastModified = new Date(0);

      return new Promise((resolve, reject) => {
        stream.on('data', (obj) => {
          totalFiles++;
          totalSize += obj.size || 0;
          if (obj.lastModified && obj.lastModified > lastModified) {
            lastModified = obj.lastModified;
          }
        });

        stream.on('end', () => {
          const stats: BucketStats = {
            totalFiles,
            totalSize,
            lastModified,
          };
          resolve(stats);
        });

        stream.on('error', reject);
      });
    } catch (error) {
      this.logger.error(`Error getting bucket stats: ${error}`);
      throw new InternalServerErrorException(
        `Failed to get bucket stats: ${error}`,
      );
    }
  }

  /**
   * Obtiene información de versiones de un archivo
   */
  async getFileVersions(key: string, bucket?: string): Promise<FileVersion[]> {
    try {
      const targetBucket = bucket || this.configMinio.bucketName;
      this.logger.log(
        `Getting versions for file: ${key} in bucket: ${targetBucket}`,
      );

      // MinIO no soporta versionado por defecto como AWS S3
      // Esta es una implementación básica
      this.logger.warn(
        'File versioning is not fully supported in MinIO. Returning basic version info.',
      );

      // Obtener información básica del archivo
      const stat = await this.storage.statObject(targetBucket, key);

      const version: FileVersion = {
        versionId: 'null', // MinIO no tiene versionado real
        isLatest: true,
        lastModified: stat.lastModified,
        size: stat.size,
        etag: stat.etag,
      };

      return [version];
    } catch (error) {
      this.logger.error(`Error getting file versions: ${error}`);
      throw new InternalServerErrorException(
        `Failed to get file versions: ${error}`,
      );
    }
  }

  private uploadFilesToMinio(localFolder: string) {
    const walkSync = (dir: string, fileList: string[] = []) => {
      const files = fs.readdirSync(dir);
      files.forEach((file) => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
          fileList = walkSync(filePath, fileList); // Recursively add files from subdirectories
        } else {
          fileList.push(filePath);
        }
      });
      return fileList;
    };

    const files = walkSync(localFolder);

    files.forEach((filePath) => {
      const relativePath = path.relative(localFolder, filePath);
      const minioPath = relativePath.replace(/\\/g, '/'); // Convert Windows-style paths to Unix-style

      // Read the file content and upload it to MinIO
      const fileStream = fs.createReadStream(filePath);
      const fileStat = fs.statSync(filePath);

      void this.storage.putObject(
        this.bucket,
        minioPath,
        fileStream,
        fileStat.size,
        (err) => {
          if (err) this.logger.error('Error uploading file: ' + err);
          else this.logger.log(`File uploaded to MinIO: ${minioPath}`);
        },
      );
    });
  }
}
