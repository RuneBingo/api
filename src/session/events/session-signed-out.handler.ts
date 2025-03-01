import { CommandBus, EventsHandler } from '@nestjs/cqrs';

import { CreateActivityCommand } from '@/activity/commands/create-activity.command';

import { SessionSignedOutEvent } from './session-signed-out.event';

@EventsHandler(SessionSignedOutEvent)
export class SessionSignedOutHandler {
  constructor(private readonly commandBus: CommandBus) {}

  async handle(event: SessionSignedOutEvent) {
    const { sessionId, requesterId } = event;

    await this.commandBus.execute(
      new CreateActivityCommand({
        key: 'session.signed-out',
        requesterId,
        trackableId: sessionId,
        trackableType: 'Session',
      }),
    );
  }
}
