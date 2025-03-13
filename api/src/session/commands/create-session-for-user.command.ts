import { Command } from '@nestjs/cqrs';

import { type User } from '@/user/user.entity';

import type { SessionMethod, Session } from '../session.entity';

export type CreateSessionForUserParams = {
  user: User;
  method: SessionMethod;
  sessionId: string;
  ip: string;
  userAgent: string;
};

export type CreateSessionForUserResult = Session;

export class CreateSessionForUserCommand extends Command<CreateSessionForUserResult> {
  public readonly user: User;
  public readonly method: SessionMethod;
  public readonly sessionId: string;
  public readonly ip: string;
  public readonly userAgent: string;

  constructor({ user, method, sessionId, ip, userAgent }: CreateSessionForUserParams) {
    super();

    this.user = user;
    this.method = method;
    this.sessionId = sessionId;
    this.ip = ip;
    this.userAgent = userAgent;
  }
}
