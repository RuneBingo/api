import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BingoController } from './bingo.controller';
import { Bingo } from './bingo.entity';
import { CreateBingoHandler } from './commands/create-bingo.handler';
import { GetBingoByIdHandler } from './queries/get-bingo-by-id.handler';
import { SearchBingosHandler } from './queries/search-bingos.handler';
import { UpdateBingoHandler } from './commands/update-bingo.handler';
import { BingoCreatedHandler } from './events/bingo-created.handler';
import { SearchBingoActivitiesHandler } from './queries/search-bingo-activities.handler';
import { FormatBingoActivitiesHandler } from './commands/format-bingo-activities.handler';
import { User } from '@/user/user.entity';
import { Activity } from '@/activity/activity.entity';

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
