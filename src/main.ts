import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';
import validationPipe from './pipes/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.useGlobalPipes(validationPipe);
  await app.listen(configService.get('BACKEND_PORT') || 5000);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
