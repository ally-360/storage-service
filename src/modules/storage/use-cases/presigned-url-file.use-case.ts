import { InjectRepository } from '@nestjs/typeorm';
import { HttpStatus, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Repository } from 'typeorm';
import { MinioAdapter } from 'src/infrastructure/adapters/minio';
import { Storage, StorageAction } from '../entities/storage.entity';
import { PresignedUrlDto } from '../dtos';

export class PresignedUrlFileUseCase {
  private readonly logger = new Logger(PresignedUrlFileUseCase.name);

  constructor(
    @InjectRepository(Storage)
    private readonly storageRepository: Repository<Storage>,
    private readonly minioAdapter: MinioAdapter,
  ) {}

  async execute(presignedUrlDto: PresignedUrlDto) {
    const { id, expiresIn = 10800, operation = 'GET' } = presignedUrlDto;
    const { bucket, tenantId } = presignedUrlDto.originInfo;

    this.logger.log(`Generating presigned URL for storage ID: ${id}`);

    // Buscar el archivo en la base de datos
    const storageRecord = await this.storageRepository.findOne({
      where: { id, bucket, tenantId }, // TODO: Pendiente revisar ya que tambien se debe tener en cuenta el tenantId - filename
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

    // Generar URL presignada usando MinIO adapter
    const presignedUrl = await this.minioAdapter.generatePresignedUrl(
      storageRecord.key,
      operation,
      expiresIn,
      storageRecord.bucket || bucket,
    );

    await this.storageRepository.update(id, {
      downloadedAt: new Date(),
      action: StorageAction.DOWNLOAD,
    });

    this.logger.log(
      `Presigned URL generated successfully for file: ${storageRecord.filename}`,
    );

    return {
      success: true,
      presignedUrl,
      expiresIn,
      operation,
      filename: storageRecord.filename,
      originalStorageId: id,
      message: 'Presigned URL generated successfully',
    };
  }
}
