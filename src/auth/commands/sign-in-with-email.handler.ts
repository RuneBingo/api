import { CommandHandler } from '@nestjs/cqrs';

import { RedisService } from '@/redis/redis.service';

import { SignInWithEmailCommand, type SignInWithEmailResult } from './sign-in-with-email.command';
import { EmailerService } from '@/emailer/emailer.service';
import { VerificationEmail } from '@/emailer/templates/verification-email';

@CommandHandler(SignInWithEmailCommand)
export class SignInWithEmailHandler {
  constructor(
    private readonly redisService: RedisService,
    private readonly emailerService: EmailerService
  ) {}

  async execute(command: SignInWithEmailCommand): Promise<SignInWithEmailResult> {
    const { email } = command;

    const code = Math.random().toString(36).substring(2, 8);

    await this.redisService.set(`auth:email:${email}`, code, (30).minutes);
    await this.emailerService.sendEmail(new VerificationEmail(email, code));

    return { code };
  }
}
