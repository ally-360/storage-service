import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UploadStorageDto } from './dto/upload.dto';
import {
  Storage,
  StorageAction,
  StorageStatus,
} from './entities/storage.entity';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  constructor(
    @InjectRepository(Storage)
    private readonly storageRepository: Repository<Storage>,
  ) {}

  async findOne(id: number) {
    const storage = await this.storageRepository.findOne({ where: { id } });
    if (!storage) {
      throw new RpcException({
        code: 404,
        message: `[404] Storage record with id ${id} not found`,
      });
    }
    return storage;
  }

  async upload(uploadDto: UploadStorageDto) {
    this.logger.log('Uploading file:', {
      filename: uploadDto.filename,
      size: uploadDto.file.length,
      mimetype: uploadDto.mimetype,
    });

    // Crear registro en la base de datos
    const storageRecord = this.storageRepository.create({
      filename: uploadDto.filename,
      originalFilename: uploadDto.filename,
      mimetype: uploadDto.mimetype,
      size: uploadDto.file.length,
      action: StorageAction.UPLOAD,
      status: StorageStatus.ACTIVE,
      metadata: {
        uploadedAt: new Date().toISOString(),
        fileType: uploadDto.mimetype,
      },
    });

    // Guardar en la base de datos
    const savedRecord = await this.storageRepository.save(storageRecord);

    // TODO: Aquí implementarías la lógica para guardar el archivo físico
    // Por ejemplo, guardar en sistema de archivos, S3, etc.

    return {
      success: true,
      storageId: savedRecord.id,
      filename: savedRecord.filename,
      size: savedRecord.size,
      message: 'File uploaded successfully',
    };
  }

  async download(id: number) {
    const storage = await this.findOne(id);

    // Registrar la descarga
    await this.storageRepository.save({
      ...storage,
      action: StorageAction.DOWNLOAD,
      updatedAt: new Date(),
    });

    return {
      success: true,
      storageId: storage.id,
      filename: storage.filename,
      size: storage.size,
      message: 'File downloaded successfully',
    };
  }

  async delete(id: number) {
    const storage = await this.findOne(id);

    // Marcar como eliminado (soft delete)
    await this.storageRepository.save({
      ...storage,
      status: StorageStatus.DELETED,
      deletedAt: new Date(),
      action: StorageAction.DELETE,
    });

    return `Storage record ${id} marked as deleted`;
  }
}
