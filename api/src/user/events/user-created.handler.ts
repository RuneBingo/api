import { CommandBus, EventsHandler } from '@nestjs/cqrs';

import { CreateActivityCommand } from '@/activity/commands/create-activity.command';

import { UserCreatedEvent } from './user-created.event';

@EventsHandler(UserCreatedEvent)
export class UserCreatedHandler {
  constructor(private readonly commandBus: CommandBus) {}

  async handle(event: UserCreatedEvent) {
    const { userId, requesterId, email, emailVerified } = event;

    await this.commandBus.execute(
      new CreateActivityCommand({
        key: 'user.created',
        requesterId,
        trackableId: userId,
        trackableType: 'User',
        parameters: { email, emailVerified },
      }),
    );
  }
}
