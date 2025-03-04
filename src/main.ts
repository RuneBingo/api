import { ConsoleLogger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { type NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';

import '@/extensions/express.extensions';
import { setupOpenApi } from '@/extensions/swagger.extensions';
import '@/extensions/number.extensions';

import { AppModule } from './app.module';
import validationPipe from './pipes/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: new ConsoleLogger({ colors: true }),
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('BACKEND_PORT', 5000);
  const env = configService.get<string>('NODE_ENV');
  const sessionSecret = configService.getOrThrow<string>('SESSION_SECRET');
  const isProduction = env !== 'development' && env !== 'test';

  app.use(cookieParser(sessionSecret));
  app.set('trust proxy', isProduction);
  app.useGlobalPipes(validationPipe);
  app.enableCors({
    origin: 'http://localhost:5173',
    methods: 'GET',
    allowedHeaders: 'Content-Type',
    credentials: true,
  });

  setupOpenApi(app, 'swagger');

  await app.listen(port);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
