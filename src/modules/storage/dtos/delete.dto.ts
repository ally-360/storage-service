import { MicroserviceRequiredInfoDto } from 'src/infrastructure/dtos';

export class DeleteStorageDto extends MicroserviceRequiredInfoDto {
  id: number;
}
