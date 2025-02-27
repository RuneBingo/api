import { QueryHandler } from '@nestjs/cqrs';

import { VerifyEmailCode } from './verify-email-code.query';
import { RedisService } from '../../redis/redis.service';

@QueryHandler(VerifyEmailCode)
export class VerifyEmailCodeHandler {
  constructor(private readonly redisService: RedisService) {}

  async execute(query: VerifyEmailCode): Promise<boolean> {
    const { email, code } = query;

    const storedCode = await this.redisService.get(`auth:email:${email}`);
    if (code === storedCode) {
      await this.redisService.delete(`auth:email:${email}`);
      return true;
    }

    return false;
  }
}
