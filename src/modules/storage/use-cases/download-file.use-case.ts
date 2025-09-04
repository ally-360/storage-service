import { InjectRepository } from '@nestjs/typeorm';
import { HttpStatus, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Repository } from 'typeorm';
import { MinioAdapter } from 'src/infrastructure/adapters/minio';
import { Storage, StorageAction } from '../entities/storage.entity';
import { DownloadStorageDto } from '../dtos';

export class DownloadFileUseCase {
  private readonly logger = new Logger(DownloadFileUseCase.name);

  constructor(
    @InjectRepository(Storage)
    private readonly storageRepository: Repository<Storage>,
    private readonly minioAdapter: MinioAdapter,
  ) {}

  async execute(downloadDto: DownloadStorageDto) {
    const { id } = downloadDto;
    const { bucket, tenantId } = downloadDto.originInfo;

    this.logger.log(`Downloading file for storage ID: ${id}`);

    // Buscar el archivo en la base de datos
    const storageRecord = await this.storageRepository.findOne({
      where: { id, bucket, tenantId }, // TODO: Pendiente revisar ya que tambien se debe tener en cuenta el filename
    });

    if (!storageRecord) {
      throw new RpcException({
        code: HttpStatus.NOT_FOUND,
        message: `[${HttpStatus.NOT_FOUND}] Storage record with ID ${id} not found`,
      });
    }

    if (!storageRecord.key || !storageRecord.bucket) {
      throw new RpcException({
        code: HttpStatus.BAD_REQUEST,
        message: `[${HttpStatus.BAD_REQUEST}] Storage record ${id} does not have bucket or key information`,
      });
    }

    // Verificar si el archivo existe en MinIO
    const fileExists = await this.minioAdapter.fileExists(
      storageRecord.key,
      storageRecord.bucket,
    );

    if (!fileExists) {
      throw new RpcException({
        code: HttpStatus.NOT_FOUND,
        message: `[${HttpStatus.NOT_FOUND}] File ${storageRecord.key} not found in bucket ${storageRecord.bucket}`,
      });
    }

    // Descargar el archivo desde MinIO
    const downloadResult = await this.minioAdapter.downloadFile(
      storageRecord.key,
      storageRecord.bucket,
    );

    // Actualizar el registro con la información de descarga
    await this.storageRepository.update(id, {
      action: StorageAction.DOWNLOAD,
      metadata: {
        ...storageRecord.metadata,
        downloadCount: (storageRecord.metadata?.downloadCount || 0) + 1,
      },
    });

    this.logger.log(`File downloaded successfully: ${storageRecord.filename}`);

    return {
      success: true,
      data: downloadResult.data,
      metadata: downloadResult.metadata,
      filename: storageRecord.filename,
      originalFilename: storageRecord.originalFilename,
      mimetype: storageRecord.mimetype,
      size: storageRecord.size,
      storageId: id,
      message: 'File downloaded successfully',
    };
  }
}
