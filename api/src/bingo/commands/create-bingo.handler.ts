import { CommandHandler, EventBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateBingoCommand, CreateBingoResult } from './create-bingo.command';
import { BingoCreatedEvent } from '../events/bingo-created.event';
import { Bingo } from '../bingo.entity';

@CommandHandler(CreateBingoCommand)
export class CreateBingoHandler {
  constructor(
    @InjectRepository(Bingo)
    private readonly bingoRepository: Repository<Bingo>,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateBingoCommand): Promise<CreateBingoResult> {
    const bingo: Bingo = this.bingoRepository.create(command.createBingoDto);
    bingo.createdById = command.requester.id;
    await this.bingoRepository.save(bingo);

    this.eventBus.publish(
      new BingoCreatedEvent({
        bingoId: bingo.id,
        requesterId: command.requester.id,
        dto: command.createBingoDto,
      }),
    );

    return bingo;
  }
}
