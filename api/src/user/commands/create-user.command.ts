import { Command } from '@nestjs/cqrs';

import { type User } from '../user.entity';

export type CreateUserParams = {
  email: string;
  emailVerified?: boolean;
  language: string;
  requester: User | 'self' | null;
};

export type CreateUserResult = User;

export class CreateUserCommand extends Command<User> {
  public readonly email: string;
  public readonly emailVerified: boolean;
  public readonly language: string;
  public readonly requester: User | 'self' | null;

  constructor({ email, emailVerified = false, language, requester }: CreateUserParams) {
    super();

    this.email = email;
    this.emailVerified = emailVerified;
    this.language = language;
    this.requester = requester;
  }
}
