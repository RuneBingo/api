import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { type AppConfig } from '../config';

export const bullModule = BullModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService<AppConfig>) => ({
    connection: {
      host: configService.getOrThrow('REDIS_URL', { infer: true }),
      port: configService.getOrThrow('REDIS_PORT', { infer: true }),
      password: configService.getOrThrow('REDIS_PASSWORD', { infer: true }),
    },
  }),
});
