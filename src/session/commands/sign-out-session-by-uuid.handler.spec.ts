/* eslint-disable @typescript-eslint/unbound-method */
import { EventBus } from '@nestjs/cqrs';
import { Test, type TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { type Repository } from 'typeorm';

import { User } from '@/user/user.entity';

import { SignOutSessionByUuidCommand } from './sign-out-session-by-uuid.command';
import { SignOutSessionByUuidHandler } from './sign-out-session-by-uuid.handler';
import { SessionSignedOutEvent } from '../events/session-signed-out.event';
import { Session } from '../session.entity';

describe('SignOutSessionByUuidHandler', () => {
  let handler: SignOutSessionByUuidHandler;
  let sessionRepository: jest.Mocked<Repository<Session>>;
  let eventBus: jest.Mocked<EventBus>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SignOutSessionByUuidHandler,
        {
          provide: getRepositoryToken(Session),
          useValue: {
            findOneBy: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: EventBus,
          useValue: {
            publish: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<SignOutSessionByUuidHandler>(SignOutSessionByUuidHandler);
    sessionRepository = module.get(getRepositoryToken(Session));
    eventBus = module.get(EventBus);
  });

  it('should emit SessionSignedOutEvent when session is signed out', async () => {
    const user = new User();
    user.id = 123;

    const session = new Session();
    session.id = 789;
    session.user = Promise.resolve(user);
    session.userId = user.id;
    session.signOut = jest.fn();

    sessionRepository.findOneBy.mockResolvedValue(session);
    sessionRepository.save.mockResolvedValue(session);

    const command = new SignOutSessionByUuidCommand({ uuid: 'valid-uuid', requester: 'self' });

    await handler.execute(command);

    expect(eventBus.publish).toHaveBeenCalledWith(new SessionSignedOutEvent({ sessionId: 789, requesterId: 123 }));
  });
});
