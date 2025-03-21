import { Query } from '@nestjs/cqrs';

import { type Bingo } from '../bingo.entity';

export type GetBingoByIdResult = Bingo;

export class GetBingoByIdQuery extends Query<GetBingoByIdResult> {
  public readonly bingoId: number;
  constructor(bingoId: number) {
    super();
    this.bingoId = bingoId;
  }
}
