import { CommandHandler } from '@nestjs/cqrs';

import { RedisService } from '@/redis/redis.service';

import { SignInWithEmailCommand, type SignInWithEmailResult } from './sign-in-with-email.command';

@CommandHandler(SignInWithEmailCommand)
export class SignInWithEmailHandler {
  constructor(private readonly redisService: RedisService) {}

  async execute(command: SignInWithEmailCommand): Promise<SignInWithEmailResult> {
    const { email } = command;

    const code = Math.random().toString(36).substring(2, 8);

    await this.redisService.set(`auth:email:${email}`, code, (30).minutes);

    return { code };
  }
}
