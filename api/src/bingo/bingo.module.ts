import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BingoController } from './bingo.controller';
import { Bingo } from './bingo.entity';
import { CreateBingoHandler } from './commands/create-bingo.handler';

@Module({
  imports: [TypeOrmModule.forFeature([Bingo])],
  controllers: [BingoController],
  providers: [CreateBingoHandler],
})
export class BingoModule {}
