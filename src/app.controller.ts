import { Controller, Get, SetMetadata, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';

import { ApiKeyGuard } from './auth/guards/api-key.guard';
import { Public } from './auth/decorators/public.decorator';

@ApiTags('root')
@UseGuards(ApiKeyGuard)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @SetMetadata('IS_PUBLIC_KEY', true)
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('tasks')
  @Public()
  getTasks(): Promise<any> {
    return this.appService.getTasks();
  }

  @Get('guard-me')
  guardMe() {
    return this.appService.guardMe();
  }

  @Get('guard-x')
  guardX() {
    return this.appService.guardX();
  }

  @Get('guard-y')
  guardY() {
    return this.appService.guardY();
  }

  @Get('public')
  @Public()
  public() {
    return this.appService.public();
  }
}
