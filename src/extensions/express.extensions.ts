/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  Request as ExpressRequest,
  Response as ExpressResponse,
  NextFunction as ExpressNextFunction,
} from 'express';
import type { Session as ExpressSession } from 'express-session';

import type { Session as SessionEntity } from '@/session/session.entity';
import type { User } from '@/user/user.entity';

declare global {
  interface Session extends ExpressSession {
    uuid?: string;
    language?: string;
  }

  interface Request extends ExpressRequest {
    session: Session;
    userEntity?: User;
    sessionEntity?: SessionEntity;
  }

  interface Response extends ExpressResponse {}

  interface NextFunction extends ExpressNextFunction {}
}

export {};
