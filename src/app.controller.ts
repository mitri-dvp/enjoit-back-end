import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';

import { ApiKeyGuard } from './auth/guards/api-key.guard';

@ApiTags('root')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('tasks')
  getTasks(): Promise<any> {
    return this.appService.getTasks();
  }

  @UseGuards(ApiKeyGuard)
  @Get('guard-me')
  guardMe() {
    return this.appService.guardMe();
  }
}
