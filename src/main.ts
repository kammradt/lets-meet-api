import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import * as config from 'config';
import { ClassSerializerInterceptor, INestApplication, ValidationPipe } from '@nestjs/common';

function addDTOsConfiguration(app: INestApplication) {
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
  }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
}

async function start() {
  const serverConfig = config.get('server');
  const port = process.env.PORT || serverConfig.port;
  const app = await NestFactory.create(AppModule);

  addDTOsConfiguration(app);

  await app.listen(port);
}

start();
