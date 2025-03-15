/* eslint-disable @typescript-eslint/unbound-method */
import { UnauthorizedException } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { Test, type TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { type Repository } from 'typeorm';

import { Session } from '@/session/session.entity';
import { User } from '@/user/user.entity';

import { CreateSessionForUserCommand } from './create-session-for-user.command';
import { CreateSessionForUserHandler } from './create-session-for-user.handler';
import { SessionCreatedEvent } from '../events/session-created.event';

describe('CreateSessionForUserHandler', () => {
  let handler: CreateSessionForUserHandler;
  let sessionRepository: jest.Mocked<Repository<Session>>;
  let eventBus: jest.Mocked<EventBus>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateSessionForUserHandler,
        {
          provide: getRepositoryToken(Session),
          useValue: {
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

    handler = module.get<CreateSessionForUserHandler>(CreateSessionForUserHandler);
    sessionRepository = module.get(getRepositoryToken(Session));
    eventBus = module.get(EventBus);
  });

  it('should throw UnauthorizedException if user is disabled', async () => {
    const user = new User();
    user.id = 123;
    user.disabledAt = new Date();

    const command = new CreateSessionForUserCommand({
      user,
      method: 'email',
      sessionId: 'session-uuid',
      ip: '127.0.0.1',
      userAgent: 'Mozilla/5.0',
    });

    await expect(handler.execute(command)).rejects.toThrow(UnauthorizedException);
  });

  it('should create a session successfully', async () => {
    const user = new User();
    user.id = 123;

    const command = new CreateSessionForUserCommand({
      user,
      method: 'email',
      sessionId: 'session-uuid',
      ip: '127.0.0.1',
      userAgent: 'Mozilla/5.0',
    });

    const mockSession = new Session();
    mockSession.id = 456;

    sessionRepository.save.mockResolvedValue(mockSession);

    const result = await handler.execute(command);

    expect(sessionRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        createdBy: 123,
        userId: 123,
        sessionID: 'session-uuid',
        method: 'email',
        ipAddress: '127.0.0.1',
        userAgent: 'Mozilla/5.0',
        deviceType: 'desktop',
        os: 'unknown',
        browser: 'unknown',
        location: 'Unknown location',
        lastSeenAt: expect.any(Date) as Date,
        expiresAt: expect.any(Date) as Date,
      }),
    );

    expect(eventBus.publish).toHaveBeenCalledWith(new SessionCreatedEvent({ sessionId: 456, requesterId: 123 }));

    expect(result).toEqual(mockSession);
  });
});
