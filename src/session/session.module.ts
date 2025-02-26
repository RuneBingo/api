import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisStore } from 'connect-redis';
import * as session from 'express-session';

import { RedisModule } from '@/redis/redis.module';
import { RedisService } from '@/redis/redis.service';

import { Session } from './session.entity';

@Module({
  imports: [RedisModule, TypeOrmModule.forFeature([Session])],
})
export class SessionModule implements NestModule {
  constructor(
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {}

  configure(consumer: MiddlewareConsumer) {
    const env = this.configService.get<string>('NODE_ENV', 'development');
    const isProduction = env !== 'development' && env !== 'test';
    const sessionSecret = this.configService.get<string>('SESSION_SECRET', 'default_secret');

    consumer
      .apply(
        session({
          store: new RedisStore({ client: this.redisService.getClient() }),
          secret: sessionSecret,
          resave: false,
          saveUninitialized: false,
          cookie: {
            secure: isProduction,
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
          },
        }),
      )
      .forRoutes('*');
  }
}
