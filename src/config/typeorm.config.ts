import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as config from 'config';

const { type, host, port, username, password, database, synchronize } = config.get('db');

export const typeORMConfig: TypeOrmModuleOptions = {
  type: type,
  host: process.env.RDS_HOST || host,
  port: process.env.RDS_PORT || port,
  username: process.env.RDS_USERNAME || username,
  password: process.env.RDS_PASSWORD || password,
  database: process.env.RDS_DB_NAME || database,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: process.env.TYPEORM_SYNC || synchronize,
};
