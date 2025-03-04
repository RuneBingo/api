import { Module } from '@nestjs/common';

import { ActivityModule } from './activity/activity.module';
import { AuthModule } from './auth/auth.module';
import { configModule } from './config';
import { cqrsModule } from './cqrs';
import { dbModule } from './db';
import { ItemsModule } from './items/items.module';
import { EmailerModule } from './emailer/emailer.module';
import { EmailerService } from './emailer/emailer.service';
import { RedisModule } from './redis/redis.module';
import { SessionModule } from './session/session.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    configModule,
    dbModule,
    cqrsModule,
    SessionModule,
    UserModule,
    AuthModule,
    RedisModule,
    ActivityModule,
    ItemsModule,
    EmailerModule,
  ],
})
export class AppModule {}
