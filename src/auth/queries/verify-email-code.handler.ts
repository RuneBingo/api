import { QueryHandler } from '@nestjs/cqrs';

import { RedisService } from '@/redis/redis.service';

import { VerifyEmailCodeQuery, type VerifyEmailCodeResult } from './verify-email-code.query';

@QueryHandler(VerifyEmailCodeQuery)
export class VerifyEmailCodeHandler {
  constructor(private readonly redisService: RedisService) {}

  async execute(query: VerifyEmailCodeQuery): Promise<VerifyEmailCodeResult> {
    const { email, code } = query;

    const storedCode = await this.redisService.get(`auth:email:${email}`);
    if (code === storedCode) {
      await this.redisService.delete(`auth:email:${email}`);
      return { valid: true };
    }

    return { valid: false };
  }
}
