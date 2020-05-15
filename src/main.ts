import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as config from 'config';

async function bootstrap() {
  const serverConfig = config.get('server');
  const port = process.env.PORT || serverConfig.port;

  const app = await NestFactory.create(AppModule);
  await app.listen(port);
}

bootstrap();
