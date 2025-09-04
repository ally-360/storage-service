export class PresignedUrlDto {
  id: number;
  expiresIn?: number; // en segundos, por defecto 3600 (1 hora)
  operation?: 'GET' | 'PUT' | 'POST'; // por defecto 'GET'
}
