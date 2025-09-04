import { InjectRepository } from '@nestjs/typeorm';
import { HttpStatus, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Repository } from 'typeorm';
import { MinioAdapter } from 'src/infrastructure/adapters/minio';
import {
  Storage,
  StorageAction,
  StorageStatus,
} from '../entities/storage.entity';
import { DeleteStorageDto } from '../dtos';

export class DeleteFileUseCase {
  private readonly logger = new Logger(DeleteFileUseCase.name);

  constructor(
    @InjectRepository(Storage)
    private readonly storageRepository: Repository<Storage>,
    private readonly minioAdapter: MinioAdapter,
  ) {}

  async execute(deleteDto: DeleteStorageDto) {
    const { id } = deleteDto;
    const { bucket, tenantId } = deleteDto.originInfo;

    this.logger.log(`Deleting file for storage ID: ${id}`);

    // Buscar el archivo en la base de datos
    const storageRecord = await this.storageRepository.findOne({
      where: { id, bucket, tenantId },
    });

    if (!storageRecord) {
      throw new RpcException({
        code: HttpStatus.NOT_FOUND,
        message: `[${HttpStatus.NOT_FOUND}] Storage record with ID ${id} not found`,
      });
    }

    if (storageRecord.status === StorageStatus.DELETED) {
      this.logger.warn(`File ${id} is already marked as deleted`);
      return {
        success: true,
        storageId: id,
        message: 'File was already deleted',
      };
    }

    // Verificar si el archivo existe en MinIO antes de eliminarlo
    if (
      storageRecord.key &&
      storageRecord.bucket &&
      storageRecord.bucket === bucket
    ) {
      const fileExists = await this.minioAdapter.fileExists(
        storageRecord.key,
        storageRecord.bucket,
      );

      if (fileExists) {
        // Eliminar archivo de MinIO
        await this.minioAdapter.deleteFile(
          storageRecord.key,
          storageRecord.bucket,
        );
        this.logger.log(`File deleted from MinIO: ${storageRecord.key}`);
      } else {
        this.logger.warn(
          `File ${storageRecord.key} not found in MinIO bucket ${storageRecord.bucket}`,
        );
      }
    }

    // Marcar como eliminado en la base de datos (soft delete)
    await this.storageRepository.update(id, {
      status: StorageStatus.DELETED,
      action: StorageAction.DELETE,
      deletedAt: new Date(),
      metadata: {
        ...storageRecord.metadata,
        deletedAt: new Date().toISOString(),
        deletedBy: tenantId, // TODO: Agregar información del usuario que elimina
      } as Record<string, any>,
    });

    this.logger.log(
      `File marked as deleted successfully: ${storageRecord.filename}`,
    );

    return {
      success: true,
      storageId: id,
      filename: storageRecord.filename,
      deletedAt: new Date(),
      message: 'File deleted successfully',
    };
  }
}
