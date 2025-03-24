import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Activity } from '@/activity/activity.entity';
import { User } from '@/user/user.entity';

import { BingoController } from './bingo.controller';
import { Bingo } from './bingo.entity';
import { CreateBingoHandler } from './commands/create-bingo.command';
import { UpdateBingoHandler } from './commands/update-bingo-command';
import { FormatBingoActivitiesHandler } from './commands/format-bingo-activities.command';
import { GetBingoByIdHandler } from './queries/get-bingo-by-id.query';
import { SearchBingosHandler } from './queries/search-bingos.query';
import { SearchBingoActivitiesHandler } from './queries/search-bingo-activities.query';
import { BingoCreatedHandler } from './events/bingo-created.event';
import { AddBingoParticipantHandler } from '@/bingo-participant/commands/add-bingo-participant.handler';
import { BingoParticipant } from '@/bingo-participant/bingo-participant.entity';
import { GetBingoParticipantsHandler } from '@/bingo-participant/queries/get-bingo-participants.handler';
import { DeleteBingoHandler } from './commands/delete-bingo-command';
import { CancelBingoHandler } from './commands/cancel-bingo-command';

@Module({
  imports: [TypeOrmModule.forFeature([Bingo, User, Activity, BingoParticipant])],
  controllers: [BingoController],
  providers: [
    //Commands
    CreateBingoHandler,
    UpdateBingoHandler,
    DeleteBingoHandler,
    FormatBingoActivitiesHandler,
    AddBingoParticipantHandler,
    CancelBingoHandler,

    //Queries
    GetBingoByIdHandler,
    SearchBingosHandler,
    SearchBingoActivitiesHandler,
    GetBingoParticipantsHandler,

    //Events
    BingoCreatedHandler,
  ],
})
export class BingoModule {}
