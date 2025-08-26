import { Controller, ParseIntPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { StorageService } from './storage.service';
import { UploadStorageDto } from './dto/upload.dto';

@Controller()
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @MessagePattern({ cmd: 'storage_find_one' })
  findOne(@Payload('id', ParseIntPipe) id: number) {
    return this.storageService.findOne(id);
  }

  @MessagePattern({ cmd: 'storage_upload' })
  upload(@Payload() uploadDto: UploadStorageDto) {
    return this.storageService.upload(uploadDto);
  }

  @MessagePattern({ cmd: 'storage_download' })
  download(@Payload() id: number) {
    return this.storageService.download(id);
  }

  @MessagePattern({ cmd: 'storage_delete' })
  delete(@Payload() id: number) {
    return this.storageService.delete(id);
  }
}
