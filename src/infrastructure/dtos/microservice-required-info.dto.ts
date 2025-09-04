import { IsNotEmpty, IsObject } from 'class-validator';

export class MicroserviceRequiredInfoDto {
  @IsObject()
  @IsNotEmpty()
  originInfo: { bucket: string; tenantId: string };
}
