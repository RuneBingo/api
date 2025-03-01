import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Activity } from './activity.entity';
import { CreateActivityHandler } from './commands/create-activity.handler';

@Module({
  imports: [TypeOrmModule.forFeature([Activity])],
  providers: [
    // Commands
    CreateActivityHandler,
  ],
})
export class ActivityModule {}
