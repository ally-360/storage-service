import { Controller, ParseIntPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { StorageService } from './storage.service';
import { UploadFileDto } from './dtos/upload-file.dto';
import { DownloadStorageDto } from './dtos/download.dto';
import { DeleteStorageDto } from './dtos/delete.dto';

@Controller()
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @MessagePattern({ cmd: 'storage_find_one' })
  findOne(@Payload('id', ParseIntPipe) id: number) {
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

  @MessagePattern({ cmd: 'storage_delete' })
  delete(@Payload() payload: DeleteStorageDto) {
    return this.storageService.delete(payload);
  }
}
