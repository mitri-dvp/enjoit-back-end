import { NestFactory, Reflector } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { ZodSerializerInterceptor, ZodValidationPipe } from 'nestjs-zod';
import { patchNestJsSwagger } from 'nestjs-zod';

import { ConfigService } from '@nestjs/config';
import { Config } from '@src/config/validation';

import { AppModule } from '@src/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ZodValidationPipe());
  app.useGlobalInterceptors(new ZodSerializerInterceptor(app.get(Reflector)));

  const config = new DocumentBuilder()
    .setTitle('Enjoit API')
    .setDescription('Documentación para el API de Enjoit')
    .setVersion('1.0')
    .build();
  patchNestJsSwagger();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.enableCors();

  const configService = app.get<ConfigService<Config>>(ConfigService);

  const port = configService.get<number>('PORT');
  await app.listen(port);
}
bootstrap();
