import { PartialType } from '@nestjs/mapped-types';
import { UploadStorageDto } from './upload-file.dto';

export class UpdateUploadedDto extends PartialType(UploadStorageDto) {
  id: number;
}
