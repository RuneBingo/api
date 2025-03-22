import { CommandBus, EventsHandler } from '@nestjs/cqrs';
import { BingoCreatedEvent } from './bingo-created.event';
import { CreateActivityCommand } from '@/activity/commands/create-activity.command';
import { Logger } from '@nestjs/common';

@EventsHandler(BingoCreatedEvent)
export class BingoCreatedHandler {
    constructor(private readonly commandBus: CommandBus,
    
  ) {}

  async handle(event: BingoCreatedEvent) {
    const { bingoId, requesterId, dto } = event.params;
    const { ...parameters } = dto;

    await this.commandBus.execute(
      new CreateActivityCommand({
        key: 'bingo.created',
        requesterId,
        trackableId: bingoId,
        trackableType: 'Bingo',
        parameters,
      }),
    );
  }
}
