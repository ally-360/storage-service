import { PartialType } from '@nestjs/mapped-types';
import { UploadStorageDto } from './upload.dto';

export class UpdateUploadedDto extends PartialType(UploadStorageDto) {
  id: number;
}
