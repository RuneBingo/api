import { ConflictException, ForbiddenException } from '@nestjs/common';
import { CommandHandler, EventBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { I18nService } from 'nestjs-i18n';
import { Repository } from 'typeorm';

import { Roles } from '@/auth/roles/roles.constants';
import { I18nTranslations } from '@/i18n/types';

import { CreateUserCommand, type CreateUserResult } from './create-user.command';
import { UserCreatedEvent } from '../events/user-created.event';
import { User } from '../user.entity';
import { UserPolicies } from '../user.policies';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler {
  constructor(
    private readonly eventBus: EventBus,
    private readonly i18nService: I18nService<I18nTranslations>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async execute(command: CreateUserCommand): Promise<CreateUserResult> {
    const { email, emailVerified, username, language, requester } = command;

    const emailNormalized = User.normalizeEmail(email);
    const userByEmail = await this.userRepository.findOneBy({ emailNormalized });
    if (userByEmail) {
      throw new ConflictException(this.i18nService.t('user.createUser.emailAlreadyExists'));
    }

    const usernameNormalized = User.normalizeUsername(username);
    const userByUsername = await this.userRepository.findOneBy({ usernameNormalized });
    if (userByUsername) {
      throw new ConflictException(this.i18nService.t('user.createUser.usernameAlreadyExists'));
    }

    const gravatarHash = User.generateGravatarHash(emailNormalized);

    let newUser = new User();
    newUser.email = email;
    newUser.emailNormalized = emailNormalized;
    newUser.emailVerified = emailVerified;
    newUser.username = username;
    newUser.usernameNormalized = usernameNormalized;
    newUser.gravatarHash = gravatarHash;
    newUser.language = language;
    newUser.createdById = requester instanceof User ? requester.id : null;
    newUser.role = Roles.User;

    const policyRequester = requester instanceof User ? requester : null;
    if (!new UserPolicies(policyRequester).canCreate(newUser)) {
      throw new ForbiddenException(this.i18nService.t('user.createUser.forbidden'));
    }

    newUser = await this.userRepository.save(newUser);

    if (requester === 'self') {
      newUser.createdById = newUser.id;
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
        username: newUser.username,
        language: newUser.language,
      }),
    );

    return newUser;
  }
}
