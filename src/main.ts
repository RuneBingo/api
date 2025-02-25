import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { type NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
import validationPipe from './pipes/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('BACKEND_PORT') || 5000;
  const env = configService.get<string>('NODE_ENV') || 'development';
  const sessionSecret = configService.get<string>('SESSION_SECRET');
  const isProduction = env !== 'development' && env !== 'test';

  app.use(cookieParser(sessionSecret));
  app.set('trust proxy', isProduction);
  app.useGlobalPipes(validationPipe);
  await app.listen(port);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
