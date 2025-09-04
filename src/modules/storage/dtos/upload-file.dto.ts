import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { MicroserviceRequiredInfoDto } from 'src/infrastructure/dtos';

export class UploadFileDto extends MicroserviceRequiredInfoDto {
  @IsString()
  filename: string;

  @IsNotEmpty()
  file: Buffer;

  @IsString()
  mimetype?: string;

  @Transform(({ value }) => Number(value))
  size?: number;
}
