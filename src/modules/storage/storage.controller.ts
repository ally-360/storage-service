import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { StorageService } from './storage.service';
import {
  UploadFileDto,
  DownloadStorageDto,
  DeleteStorageDto,
  PresignedUrlDto,
} from './dtos';

@Controller()
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @MessagePattern({ cmd: 'storage_find_one' })
  findOne(@Payload('id', ParseUUIDPipe) id: string) {
    return this.storageService.findOne(id);
  }

  @MessagePattern({ cmd: 'storage_upload' })
  upload(@Payload() payload: UploadFileDto) {
    return this.storageService.upload(payload);
  }

  @MessagePattern({ cmd: 'storage_download' })
  download(@Payload() payload: DownloadStorageDto) {
    return this.storageService.download(payload);
  }

  @MessagePattern({ cmd: 'storage_presigned_url' })
  generatePresignedUrl(@Payload() payload: PresignedUrlDto) {
    return this.storageService.generatePresignedUrl(payload);
  }

  @MessagePattern({ cmd: 'storage_delete' })
  delete(@Payload() payload: DeleteStorageDto) {
    return this.storageService.delete(payload);
  }
}
