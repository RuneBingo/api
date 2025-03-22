import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BingoController } from './bingo.controller';
import { Bingo } from './bingo.entity';
import { CreateBingoHandler } from './commands/create-bingo.handler';
import { GetBingoByIdHandler } from './queries/get-bingo-by-id.handler';
import { SearchBingosHandler } from './queries/search-bingos.handler';
import { AddBingoParticipantHandler } from '@/bingo-participant/commands/add-bingo-participant.handler';
import { BingoParticipant } from '@/bingo-participant/bingo-participant.entity';
import { GetBingoParticipantsHandler } from '@/bingo-participant/queries/get-bingo-participants.handler';

@Module({
  imports: [TypeOrmModule.forFeature([Bingo, BingoParticipant])],
  controllers: [BingoController],
  providers: [CreateBingoHandler, GetBingoByIdHandler, SearchBingosHandler, AddBingoParticipantHandler, GetBingoParticipantsHandler],
})
export class BingoModule {}
