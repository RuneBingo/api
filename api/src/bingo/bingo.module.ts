import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BingoController } from './bingo.controller';
import { Bingo } from './bingo.entity';
import { CreateBingoHandler } from './commands/create-bingo.handler';
import { GetBingoByIdHandler } from './queries/get-bingo-by-id.handler';
import { SearchBingosHandler } from './queries/search-bingos.handler';
import { UpdateBingoHandler } from './commands/update-bingo.handler';

@Module({
  imports: [TypeOrmModule.forFeature([Bingo])],
  controllers: [BingoController],
  providers: [CreateBingoHandler, GetBingoByIdHandler, SearchBingosHandler, UpdateBingoHandler],
})
export class BingoModule {}
