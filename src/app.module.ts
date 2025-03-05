import { Module } from '@nestjs/common';

import { ActivityModule } from './activity/activity.module';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { configModule } from './config';
import { cqrsModule } from './cqrs';
import { dbModule } from './db';
import { EmailerModule } from './emailer/emailer.module';
import { EmailerService } from './emailer/emailer.service';
import { bullModule } from './jobs/bull';
import { JobsModule } from './jobs/jobs.module';
import { RedisModule } from './redis/redis.module';
import { SessionModule } from './session/session.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    configModule,
    bullModule,
    dbModule,
    cqrsModule,
    SessionModule,
    UserModule,
    AuthModule,
    RedisModule,
    ActivityModule,
    EmailerModule,
    JobsModule,
  ],
  providers: [EmailerService],
  controllers: [AppController],
})
export class AppModule {}
