/* eslint-disable @typescript-eslint/unbound-method */
import { ConflictException } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { Test, type TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { type Repository } from 'typeorm';

import { CreateUserCommand } from './create-user.command';
import { CreateUserHandler } from './create-user.handler';
import { UserCreatedEvent } from '../events/user-created.event';
import { User } from '../user.entity';

describe('CreateUserHandler', () => {
  let handler: CreateUserHandler;
  let userRepository: jest.Mocked<Repository<User>>;
  let eventBus: jest.Mocked<EventBus>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserHandler,
        {
          provide: getRepositoryToken(User),
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

    handler = module.get<CreateUserHandler>(CreateUserHandler);
    userRepository = module.get(getRepositoryToken(User));
    eventBus = module.get(EventBus);
  });

  it('should create a new user successfully', async () => {
    // Arrange
    const command = new CreateUserCommand({
      email: 'test@example.com',
      emailVerified: true,
      language: 'en',
      requester: 'self',
    });

    const newUser = new User();
    newUser.id = 1;
    newUser.email = command.email;
    newUser.emailNormalized = 'test@example.com';
    newUser.emailVerified = command.emailVerified;

    userRepository.findOneBy.mockResolvedValue(null);
    userRepository.save.mockResolvedValueOnce(newUser);
    userRepository.save.mockResolvedValueOnce({ ...newUser, createdBy: newUser.id } as User);

    const result = await handler.execute(command);

    expect(userRepository.findOneBy).toHaveBeenCalledWith({
      emailNormalized: 'test@example.com',
    });
    expect(userRepository.save).toHaveBeenCalledTimes(2);
    expect(eventBus.publish).toHaveBeenCalledWith(
      new UserCreatedEvent({
        userId: newUser.id,
        requesterId: newUser.id,
        email: newUser.email,
        emailVerified: newUser.emailVerified,
      }),
    );
    expect(result).toEqual(newUser);
  });

  it('should throw ConflictException if user with email already exists', async () => {
    const command = new CreateUserCommand({
      email: 'test@example.com',
      emailVerified: true,
      language: 'en',
      requester: 'self',
    });

    const existingUser = new User();
    existingUser.id = 2;
    existingUser.email = command.email;

    userRepository.findOneBy.mockResolvedValue(existingUser);

    await expect(handler.execute(command)).rejects.toThrow(
      new ConflictException(`User with email test@example.com already exists`),
    );

    expect(userRepository.findOneBy).toHaveBeenCalledWith({
      emailNormalized: 'test@example.com',
    });
    expect(userRepository.save).not.toHaveBeenCalled();
    expect(eventBus.publish).not.toHaveBeenCalled();
  });

  it('should correctly set createdBy when requester is another user', async () => {
    const requester = new User();
    requester.id = 3;

    const command = new CreateUserCommand({
      email: 'other@example.com',
      emailVerified: false,
      language: 'en',
      requester,
    });

    const newUser = new User();
    newUser.id = 4;
    newUser.email = command.email;
    newUser.createdBy = requester.id;

    userRepository.findOneBy.mockResolvedValue(null);
    userRepository.save.mockResolvedValueOnce(newUser);

    const result = await handler.execute(command);

    expect(userRepository.save).toHaveBeenCalledWith(expect.objectContaining({ createdBy: requester.id }));
    expect(eventBus.publish).toHaveBeenCalledWith(
      new UserCreatedEvent({
        userId: newUser.id,
        requesterId: requester.id,
        email: newUser.email,
        emailVerified: newUser.emailVerified,
      }),
    );
    expect(result).toEqual(newUser);
  });
});
