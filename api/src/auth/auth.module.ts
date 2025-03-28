import { Module } from '@nestjs/common';

import { EmailerModule } from '@/emailer/emailer.module';
import { RedisModule } from '@/redis/redis.module';

import { AuthController } from './auth.controller';
import { SignInWithEmailHandler } from './commands/sign-in-with-email.handler';
import { VerifyEmailCodeHandler } from './queries/verify-email-code.handler';

@Module({
  imports: [RedisModule, EmailerModule],
  controllers: [AuthController],
  providers: [
    // Commands
    SignInWithEmailHandler,
    VerifyEmailCodeHandler,
  ],
})
export class AuthModule {}
