import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from 'pg';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: configService.get('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
        synchronize: false,
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: 'POSTGRES',
      useFactory: (configService: ConfigService) => {
        const client = new Client({
          user: configService.get('POSTGRES_USER'),
          host: configService.get('POSTGRES_HOST'),
          database: configService.get('POSTGRES_DB'),
          password: configService.get('POSTGRES_PASSWORD'),
          port: configService.get('POSTGRES_PORT'),
        });

        client.connect();

        return client;
      },
      inject: [ConfigService],
    },
  ],
  exports: ['POSTGRES', TypeOrmModule],
})
export class DatabaseModule {}
