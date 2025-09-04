import { MicroserviceRequiredInfoDto } from 'src/infrastructure/dtos';

export class PresignedUrlDto extends MicroserviceRequiredInfoDto {
  id: string;
  expiresIn?: number; // en segundos, por defecto 10800 (3 horas)
  operation?: 'GET' | 'PUT' | 'POST'; // por defecto 'GET'
}
