import { PartialType } from '@nestjs/mapped-types';
import { UploadFileDto } from './upload-file.dto';

export class UpdateUploadedDto extends PartialType(UploadFileDto) {
  id: number;
}
