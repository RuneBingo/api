import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BingoController } from './bingo.controller';
import { Bingo } from './bingo.entity';
import { CreateBingoHandler } from './commands/create-bingo.handler';
import { FindBingoByIdHandler } from './queries/find-bingo-by-id.handler';
import { GetBingosHandler } from './queries/get-bingos.handler';
@Module({
  imports: [TypeOrmModule.forFeature([Bingo])],
  controllers: [BingoController],
  providers: [CreateBingoHandler, FindBingoByIdHandler, GetBingosHandler],
})
export class BingoModule {}
