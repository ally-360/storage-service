import { MicroserviceRequiredInfoDto } from 'src/infrastructure/dtos';

export class DownloadStorageDto extends MicroserviceRequiredInfoDto {
  id: string;
  path?: string;
}
