import { Inject, Injectable } from '@nestjs/common';

import { ConfigService, ConfigType } from '@nestjs/config';
import { Config } from './config/validation';
import config from './config/config';
import { Client } from 'pg';

@Injectable()
export class AppService {
  constructor(
    // private configService: ConfigService<Config>,
    @Inject(config.KEY) private configService: ConfigType<typeof config>,
    @Inject('POSTGRES') private pg: Client,
  ) {}

  getHello(): string {
    const apiKey = this.configService.server.port;
    const database = this.configService.database.database;
    return `apiKey: ${apiKey}, database: ${database}`;
  }

  async getTasks(): Promise<any> {
    const res = await this.pg.query('SELECT * FROM tasks');
    return res.rows;
  }

  async guardMe() {
    return 'Access granted!';
  }
}
