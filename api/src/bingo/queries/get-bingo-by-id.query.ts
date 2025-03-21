import { Query } from '@nestjs/cqrs';

import { type Bingo } from '../bingo.entity';
import { User } from '@/user/user.entity';

export type GetBingoByIdParams = {
  bingoId: number;
  requester: User | undefined;
}

export type GetBingoByIdResult = Bingo;

export class GetBingoByIdQuery extends Query<GetBingoByIdResult> {
  constructor(public readonly params: GetBingoByIdParams) {
    super();
  }
}
