import { type NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';

export function setupOpenApi(app: NestExpressApplication, path: string) {
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
    jsonDocumentUrl: `open-api`,
    customCss: new SwaggerTheme().getBuffer(SwaggerThemeNameEnum.DARK_MONOKAI),
  });
}
