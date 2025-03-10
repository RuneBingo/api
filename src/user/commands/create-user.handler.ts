import { ConflictException } from '@nestjs/common';
import { CommandHandler, EventBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserCommand, type CreateUserResult } from './create-user.command';
import { UserCreatedEvent } from '../events/user-created.event';
import { User } from '../user.entity';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler {
  constructor(
    private readonly eventBus: EventBus,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async execute(command: CreateUserCommand): Promise<CreateUserResult> {
    const { email, emailVerified, requester } = command;

    const emailNormalized = User.normalizeEmail(email);
    const user = await this.userRepository.findOneBy({ emailNormalized });
    if (user) {
      throw new ConflictException(`User with email ${email} already exists`);
    }

    let newUser = new User();
    newUser.email = email;
    newUser.emailNormalized = emailNormalized;
    newUser.emailVerified = emailVerified;
    newUser.createdBy = requester instanceof User ? requester.id : null;

    newUser = await this.userRepository.save(newUser);

    if (requester === 'self') {
      newUser.createdBy = newUser.id;
      newUser = await this.userRepository.save(newUser);
    }

    const requesterId = (() => {
      if (requester === 'self') return newUser.id;
      if (requester instanceof User) return requester.id;
      return null;
    })();

    this.eventBus.publish(
      new UserCreatedEvent({
        userId: newUser.id,
        requesterId,
        email: newUser.email,
        emailVerified: newUser.emailVerified,
      }),
    );

    return newUser;
  }
}
