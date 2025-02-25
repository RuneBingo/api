import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import configModule from './config';
import dbModule from './db/db.module';

@Module({
  imports: [configModule, dbModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
