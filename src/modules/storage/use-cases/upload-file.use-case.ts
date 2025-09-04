import { InjectRepository } from '@nestjs/typeorm';
import { Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { MinioAdapter } from 'src/infrastructure/adapters/minio';
import {
  Storage,
  StorageAction,
  StorageStatus,
} from '../entities/storage.entity';
import { UploadFileDto } from '../dtos/upload-file.dto';

export class UploadFileUseCase {
  private readonly logger = new Logger(UploadFileUseCase.name);
  constructor(
    @InjectRepository(Storage)
    private readonly storageRepository: Repository<Storage>,
    private readonly minioAdapter: MinioAdapter,
  ) {}

  async execute(uploadFileDto: UploadFileDto) {
    const { bucket, tenantId } = uploadFileDto.originInfo;
    this.logger.log('Origin info:', { bucket, tenantId });

    this.logger.log('Uploading file:', {
      filename: uploadFileDto.filename,
      size: uploadFileDto.file.length,
      mimetype: uploadFileDto.mimetype,
    });

    // Crear registro en la base de datos
    const storageRecord = this.storageRepository.create({
      bucket,
      tenantId,
      filename: uploadFileDto.filename,
      originalFilename: uploadFileDto.filename,
      mimetype: uploadFileDto.mimetype,
      size: uploadFileDto.file.length,
      action: StorageAction.UPLOAD,
      status: StorageStatus.ACTIVE,
      metadata: {
        uploadedAt: new Date().toISOString(),
        fileType: uploadFileDto.mimetype,
      },
    });

    // Guardar en la base de datos
    const savedRecord = await this.storageRepository.save(storageRecord);

    // Subir archivo a MinIO
    const uploadResult = await this.minioAdapter.uploadFile(
      uploadFileDto.file,
      uploadFileDto.filename,
      bucket,
      {
        'original-filename': uploadFileDto.filename,
        'storage-id': savedRecord.id.toString(),
        'upload-timestamp': new Date().toISOString(),
      },
    );

    // Actualizar el registro con la información de MinIO
    await this.storageRepository.update(savedRecord.id, {
      filePath: uploadResult.key,
      bucket: uploadResult.bucket,
      key: uploadResult.key,
      metadata: {
        ...savedRecord.metadata,
        // minioBucket: uploadResult.bucket,
      },
    });

    this.logger.log(`File uploaded to MinIO successfully: ${uploadResult.key}`);

    return {
      success: true,
      storageId: savedRecord.id,
      filename: savedRecord.filename,
      size: savedRecord.size,
      minioKey: uploadResult.key,
      bucket: uploadResult.bucket,
      etag: uploadResult.etag,
      message: 'File uploaded successfully',
    };
  }
}
