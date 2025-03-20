import { CommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateBingoCommand, CreateBingoResult } from './create-bingo.command';
import { Bingo } from '../bingo.entity';

@CommandHandler(CreateBingoCommand)
export class CreateBingoHandler {
  constructor(
    @InjectRepository(Bingo)
    private readonly bingoRepository: Repository<Bingo>,
  ) {}

  async execute(command: CreateBingoCommand): Promise<CreateBingoResult> {
    const bingo: Bingo = this.bingoRepository.create(command.createBingoDto);
    bingo.createdBy = command.requester.id;
    await this.bingoRepository.save(bingo);

    return bingo;
  }
}
