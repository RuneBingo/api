import type {
  Request as ExpressRequest,
  Response as ExpressResponse,
  NextFunction as ExpressNextFunction,
} from 'express';
import type { Session as ExpressSession } from 'express-session';

import type { Session } from '@/session/session.entity';
import type { User } from '@/user/user.entity';

export type ApiSession = ExpressSession & {
  uuid?: string;
};

export type ApiRequest = ExpressRequest & {
  session: ApiSession;
  userEntity?: User;
  sessionEntity?: Session;
};

export type ApiResponse = ExpressResponse;

export type ApiNextFunction = ExpressNextFunction;
