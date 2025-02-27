import { ConsoleLogger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { type NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';

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

  setupOpenApi(app, 'swagger');

  await app.listen(port);
}

function setupOpenApi(app: NestExpressApplication, path: string) {
  const options = new DocumentBuilder()
    .setTitle('RuneBingo')
    .setDescription(
      `REST API for RuneBingo, an application that lets Old School RuneScape
      players create and manage bingo events.`,
    )
    .setVersion('0.0.1')
    .addBearerAuth()
    .addCookieAuth()
    .build();

  const documentFactory = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(path, app, documentFactory, {
    jsonDocumentUrl: `${path}/json`,
    customCss: new SwaggerTheme().getBuffer(SwaggerThemeNameEnum.DARK_MONOKAI),
  });
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
