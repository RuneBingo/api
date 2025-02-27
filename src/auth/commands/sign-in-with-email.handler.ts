import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CommandHandler } from '@nestjs/cqrs';

import { RedisService } from '@/redis/redis.service';

import { SignInWithEmailCommand } from './sign-in-with-email.command';

@CommandHandler(SignInWithEmailCommand)
export class SignInWithEmailHandler {
  private readonly logger = new Logger(SignInWithEmailHandler.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {}

  async execute(command: SignInWithEmailCommand) {
    const { email } = command;

    const code = Math.random().toString(36).substring(2, 8);

    await this.redisService.set(`auth:email:${email}`, code, 300);

    if (this.configService.get('NODE_ENV') === 'development') {
      this.logger.log(`Generated code ${code} for email ${email}`);
    }

    return code;
  }
}
