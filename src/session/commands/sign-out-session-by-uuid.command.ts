import { Command } from '@nestjs/cqrs';

import { type User } from '@/user/user.entity';

import { type Session } from '../session.entity';

export type SignOutSessionByUuidParams = {
  uuid: string;
  requester: User | 'self';
};

export type SignOutSessionByUuidResult = Session | null;

export class SignOutSessionByUuidCommand extends Command<SignOutSessionByUuidResult> {
  public readonly uuid: string;
  public readonly requester: User | 'self';

  constructor({ uuid, requester }: SignOutSessionByUuidParams) {
    super();

    this.uuid = uuid;
    this.requester = requester;
  }
}
