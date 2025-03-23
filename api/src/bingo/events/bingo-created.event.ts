import { CommandBus, EventsHandler } from '@nestjs/cqrs';
import { type CreateBingoDto } from '../dto/create-bingo.dto';
import { CreateActivityCommand } from '@/activity/commands/create-activity.command';

export type BingoCreatedParams = {
  bingoId: number;
  requesterId: number;
  language: string;
  title: string;
  description: string;
  private: boolean;
  width: number;
  height: number;
  fullLineValue: number;
  startDate: Date;
  endDate: Date;
};

export class BingoCreatedEvent {
  constructor(public readonly params: BingoCreatedParams) {}
}

@EventsHandler(BingoCreatedEvent)
export class BingoCreatedHandler {
  constructor(private readonly commandBus: CommandBus) {}

  async handle(event: BingoCreatedEvent) {
    const { bingoId, requesterId, ...parameters } = event.params;

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
