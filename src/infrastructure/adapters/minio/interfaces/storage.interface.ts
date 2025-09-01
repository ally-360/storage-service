export interface MinioConfig {
  apiEndpoint: string;
  port: number;
  useSSL: boolean;
  accessKey: string;
  secretKey: string;
  bucketName: string;
}

export interface FileMetadata {
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  bucket: string;
  key: string;
  etag?: string;
  versionId?: string;
}

export interface UploadResult {
  success: boolean;
  bucket: string;
  key: string;
  etag: string;
  versionId?: string;
  url?: string;
  metadata: FileMetadata;
}

export interface DownloadResult {
  success: boolean;
  data: Buffer;
  metadata: FileMetadata;
  stream?: any;
}

export interface BucketStats {
  totalFiles: number;
  totalSize: number;
  lastModified: Date;
}

export interface ListFilesResult {
  files: FileMetadata[];
  nextContinuationToken?: string;
  isTruncated: boolean;
}

export interface FileVersion {
  versionId: string;
  isLatest: boolean;
  lastModified: Date;
  size: number;
  etag: string;
}

export interface LifecycleRule {
  id: string;
  status: 'Enabled' | 'Disabled';
  filter?: any;
  transitions?: any[];
  expiration?: any;
}

export interface StorageInterface {
  /**
   * Verifica si el bucket existe, si no lo crea
   */
  ensureBucketExists(bucketName?: string): Promise<boolean>;

  /**
   * Sube un archivo
   */
  uploadFile(
    file: Buffer,
    filename: string,
    bucket?: string,
    metadata?: Record<string, any>,
  ): Promise<UploadResult>;

  /**
   * Descarga un archivo
   */
  downloadFile(
    key: string,
    bucket?: string,
    versionId?: string,
  ): Promise<DownloadResult>;

  /**
   * Elimina un archivo
   */
  deleteFile(
    key: string,
    bucket?: string,
    versionId?: string,
  ): Promise<boolean>;

  /**
   * Copia un archivo dentro del mismo bucket o entre buckets
   */
  copyFile(
    sourceKey: string,
    destinationKey: string,
    sourceBucket?: string,
    destinationBucket?: string,
  ): Promise<boolean>;

  /**
   * Obtiene metadatos de un archivo
   */
  getFileMetadata(
    key: string,
    bucket?: string,
    versionId?: string,
  ): Promise<FileMetadata>;

  /**
   * Genera URL de acceso temporal (presigned URL)
   */
  generatePresignedUrl(
    key: string,
    operation: 'GET' | 'PUT' | 'POST',
    expiresIn: number,
    bucket?: string,
  ): Promise<string>;

  /**
   * Lista archivos en un bucket con paginación
   */
  listFiles(
    bucket?: string,
    prefix?: string,
    maxKeys?: number,
    continuationToken?: string,
  ): Promise<ListFilesResult>;

  /**
   * Verifica si un archivo existe
   */
  fileExists(
    key: string,
    bucket?: string,
    versionId?: string,
  ): Promise<boolean>;

  /**
   * Obtiene el tamaño de un archivo
   */
  getFileSize(
    key: string,
    bucket?: string,
    versionId?: string,
  ): Promise<number>;

  /**
   * Obtiene estadísticas del bucket
   */
  getBucketStats(bucket?: string): Promise<BucketStats>;

  /**
   * Obtiene información de versiones de un archivo
   */
  getFileVersions(key: string, bucket?: string): Promise<FileVersion[]>;
}
