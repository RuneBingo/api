import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisStore } from 'connect-redis';
import session from 'express-session';

import { RedisModule } from '@/redis/redis.module';
import { RedisService } from '@/redis/redis.service';

import { CreateSessionForUserHandler } from './commands/create-session-for-user.handler';
import { SignOutSessionByUuidHandler } from './commands/sign-out-session-by-uuid.handler';
import { SessionCreatedHandler } from './events/session-created.handler';
import { SessionSignedOutHandler } from './events/session-signed-out.handler';
import { Session } from './session.entity';

@Module({
  imports: [RedisModule, TypeOrmModule.forFeature([Session])],
  providers: [
    // Commands
    CreateSessionForUserHandler,
    SignOutSessionByUuidHandler,
    // Events
    SessionCreatedHandler,
    SessionSignedOutHandler,
  ],
})
export class SessionModule implements NestModule {
  constructor(
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {}

  configure(consumer: MiddlewareConsumer) {
    const env = this.configService.get<string>('NODE_ENV');
    const isProduction = env !== 'development' && env !== 'test';
    const sessionSecret = this.configService.getOrThrow<string>('SESSION_SECRET');

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
