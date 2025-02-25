import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { configModule } from './config';
import { cqrsModule } from './cqrs';
import { dbModule } from './db/db.module';
import { SessionModule } from './session/session.module';
import { UserModule } from './user/user.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [configModule, dbModule, cqrsModule, SessionModule, UserModule, AuthModule, RedisModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
