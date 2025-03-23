import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Activity } from '@/activity/activity.entity';
import { User } from '@/user/user.entity';

import { BingoController } from './bingo.controller';
import { Bingo } from './bingo.entity';
import { CreateBingoHandler } from './commands/create-bingo.handler';
import { FormatBingoActivitiesHandler } from './commands/format-bingo-activities.handler';
import { UpdateBingoHandler } from './commands/update-bingo.handler';
import { BingoCreatedHandler } from './events/bingo-created.handler';
import { GetBingoByIdHandler } from './queries/get-bingo-by-id.handler';
import { SearchBingoActivitiesHandler } from './queries/search-bingo-activities.handler';
import { SearchBingosHandler } from './queries/search-bingos.handler';

@Module({
  imports: [TypeOrmModule.forFeature([Bingo, User, Activity])],
  controllers: [BingoController],
  providers: [
    //Commands
    CreateBingoHandler,
    UpdateBingoHandler,
    FormatBingoActivitiesHandler,

    //Queries
    GetBingoByIdHandler,
    SearchBingosHandler,
    SearchBingoActivitiesHandler,

    //Events
    BingoCreatedHandler,
  ],
})
export class BingoModule {}
