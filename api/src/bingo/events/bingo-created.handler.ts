import { CommandBus, EventsHandler } from '@nestjs/cqrs';

import { CreateActivityCommand } from '@/activity/commands/create-activity.command';

import { BingoCreatedEvent } from './bingo-created.event';

@EventsHandler(BingoCreatedEvent)
export class BingoCreatedHandler {
  constructor(private readonly commandBus: CommandBus) {}

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
