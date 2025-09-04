import { MicroserviceRequiredInfoDto } from 'src/infrastructure/dtos';

export class DownloadStorageDto extends MicroserviceRequiredInfoDto {
  id: number;
  path?: string;
}
