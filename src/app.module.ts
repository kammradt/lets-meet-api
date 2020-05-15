import { Module } from '@nestjs/common';
import { TypeOrmCoreModule } from '@nestjs/typeorm/dist/typeorm-core.module';
import { typeORMConfig } from './config/typeorm.config';

@Module({
  imports: [
    TypeOrmCoreModule.forRoot(typeORMConfig),
  ],
})
export class AppModule {
}
