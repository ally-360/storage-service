import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorageService } from './storage.service';
import { StorageController } from './storage.controller';
import { Storage } from './entities/storage.entity';
import { MinioAdapter } from 'src/infrastructure/adapters/minio';
import { UseCaseFactory } from './factories/use-case.factory';
import * as useCases from './use-cases';

@Module({
  imports: [TypeOrmModule.forFeature([Storage])],
  controllers: [StorageController],
  providers: [
    StorageService,
    MinioAdapter,
    ...Object.values(useCases),
    UseCaseFactory,
  ],
})
export class StorageModule {}
