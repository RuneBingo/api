import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const bullModule = BullModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    connection: {
      host: configService.getOrThrow<string>('REDIS_URL'),
      port: configService.getOrThrow<number>('REDIS_PORT'),
      password: configService.getOrThrow<string>('REDIS_PASSWORD'),
    },
  }),
});
