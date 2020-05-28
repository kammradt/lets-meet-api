import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as config from 'config';

const {
  type,
  host,
  port,
  username,
  password,
  database,
  synchronize,
} = config.get('db');

export const typeORMConfig: TypeOrmModuleOptions = {
  type: type,
  host: process.env.DB_HOST || host,
  port: process.env.DB_PORT || port,
  username: process.env.DB_USERNAME || username,
  password: process.env.DB_PASSWORD || password,
  database: process.env.DB_NAME || database,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: process.env.TYPEORM_SYNC || synchronize,
};
