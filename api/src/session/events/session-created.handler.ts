import { CommandBus, EventsHandler } from '@nestjs/cqrs';

import { CreateActivityCommand } from '@/activity/commands/create-activity.command';

import { SessionCreatedEvent } from './session-created.event';

@EventsHandler(SessionCreatedEvent)
export class SessionCreatedHandler {
  constructor(private readonly commandBus: CommandBus) {}

  async handle(event: SessionCreatedEvent) {
    const { sessionId, requesterId } = event;

    await this.commandBus.execute(
      new CreateActivityCommand({
        key: 'session.created',
        requesterId,
        trackableId: sessionId,
        trackableType: 'Session',
      }),
    );
  }
}
