import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';
import { Repository } from 'typeorm';
import { UploadFileDto } from './dtos/upload-file.dto';
import { DownloadStorageDto } from './dtos/download.dto';
import { PresignedUrlDto } from './dtos/presigned-url.dto';
import { DeleteStorageDto } from './dtos/delete.dto';
import { Storage } from './entities/storage.entity';
import {
  UploadFileUseCase,
  DownloadFileUseCase,
  PresignedUrlFileUseCase,
  DeleteFileUseCase,
} from './use-cases';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  constructor(
    @InjectRepository(Storage)
    private readonly storageRepository: Repository<Storage>,
    private readonly uploadFileUseCase: UploadFileUseCase,
    private readonly downloadFileUseCase: DownloadFileUseCase,
    private readonly presignedUrlFileUseCase: PresignedUrlFileUseCase,
    private readonly deleteFileUseCase: DeleteFileUseCase,
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

  async upload(uploadDto: UploadFileDto) {
    return this.uploadFileUseCase.execute(uploadDto);
  }

  async download(downloadDto: DownloadStorageDto) {
    return this.downloadFileUseCase.execute(downloadDto);
  }

  async generatePresignedUrl(presignedUrlDto: PresignedUrlDto) {
    return this.presignedUrlFileUseCase.execute(presignedUrlDto);
  }

  async delete(deleteDto: DeleteStorageDto) {
    return this.deleteFileUseCase.execute(deleteDto);
  }
}
