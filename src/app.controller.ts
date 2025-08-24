import { MessagePattern } from '@nestjs/microservices';
import { Controller } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('storage')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'health' })
  getHealth() {
    return this.appService.getHealth();
  }
}
