import { Query } from '@nestjs/cqrs';

import { type User } from '@/user/user.entity';

import { type Bingo } from '../bingo.entity';

export type GetBingoByIdParams = {
  bingoId: number;
  requester: User | undefined;
};

export type GetBingoByIdResult = Bingo;

export class GetBingoByIdQuery extends Query<GetBingoByIdResult> {
  constructor(public readonly params: GetBingoByIdParams) {
    super();
  }
}
