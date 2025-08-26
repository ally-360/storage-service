import { Transform } from 'class-transformer';

export class UploadStorageDto {
  filename: string;
  file: Buffer;
  mimetype?: string;

  @Transform(({ value }) => Number(value))
  size?: number;
}
