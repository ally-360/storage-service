import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { configuration } from './config/configuration';
import { AllyExceptionInterceptor } from './infrastructure/interceptors/exception.interceptor';
import { ResponseInterceptor } from './infrastructure/interceptors/response.interceptor';

async function bootstrap() {
  const logger = new Logger('StorageService');
  const config = await configuration();
  logger.log(config);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: config.app.host,
        port: config.app.port,
      },
    },
  );

  // Configurar interceptores globales
  app.useGlobalInterceptors(
    new ResponseInterceptor(),
    new AllyExceptionInterceptor(),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  logger.log(
    `Storage micro-service is running on ${config.app.host}:${config.app.port}`,
  );
  await app.listen();
}
void bootstrap();
