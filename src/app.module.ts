import { Module } from '@nestjs/common';
import { TypeOrmCoreModule } from '@nestjs/typeorm/dist/typeorm-core.module';
import { typeORMConfig } from './config/typeorm.config';
import { UserModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { EventModule } from './events/event.module';

@Module({
  imports: [
    TypeOrmCoreModule.forRoot(typeORMConfig),
    UserModule,
    AuthModule,
    EventModule,
  ],
})
export class AppModule {}
