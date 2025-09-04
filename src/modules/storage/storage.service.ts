import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';
import { Repository } from 'typeorm';
import {
  UploadFileDto,
  DownloadStorageDto,
  PresignedUrlDto,
  DeleteStorageDto,
} from './dtos';
import { Storage } from './entities/storage.entity';
import { UseCaseFactory } from './factories/use-case.factory';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  constructor(
    @InjectRepository(Storage)
    private readonly storageRepository: Repository<Storage>,
    private readonly useCaseFactory: UseCaseFactory,
  ) {}

  async findOne(id: string) {
    this.logger.log(`Finding storage record with ID: ${id}`);

    const storage = await this.storageRepository.findOne({ where: { id } });
    if (!storage) {
      this.logger.warn(`Storage record with ID ${id} not found`);
      throw new RpcException({
        code: 404,
        message: `[404] Storage record with id ${id} not found`,
      });
    }

    this.logger.log(`Storage record found: ${storage.filename}`);
    return storage;
  }

  async upload(uploadDto: UploadFileDto) {
    this.logger.log(`Starting file upload: ${uploadDto.filename}`);

    const useCase = this.useCaseFactory.getUploadUseCase();
    const result = await useCase.execute(uploadDto);

    this.logger.log(
      `File upload completed successfully: ${uploadDto.filename}`,
    );
    return result;
  }

  async download(downloadDto: DownloadStorageDto) {
    this.logger.log(`Starting file download for ID: ${downloadDto.id}`);

    const useCase = this.useCaseFactory.getDownloadUseCase();
    const result = await useCase.execute(downloadDto);

    this.logger.log(
      `File download completed successfully for ID: ${downloadDto.id}`,
    );
    return result;
  }

  async generatePresignedUrl(presignedUrlDto: PresignedUrlDto) {
    this.logger.log(
      `Generating presigned URL for ID: ${presignedUrlDto.id}, operation: ${presignedUrlDto.operation || 'GET'}`,
    );

    const useCase = this.useCaseFactory.getPresignedUrlUseCase();
    const result = await useCase.execute(presignedUrlDto);

    this.logger.log(
      `Presigned URL generated successfully for ID: ${presignedUrlDto.id}`,
    );
    return result;
  }

  async delete(deleteDto: DeleteStorageDto) {
    this.logger.log(`Starting file deletion for ID: ${deleteDto.id}`);

    const useCase = this.useCaseFactory.getDeleteUseCase();
    const result = await useCase.execute(deleteDto);

    this.logger.log(
      `File deletion completed successfully for ID: ${deleteDto.id}`,
    );
    return result;
  }
}
