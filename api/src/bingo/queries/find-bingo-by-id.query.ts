import { Query } from '@nestjs/cqrs';

import { type Bingo } from '../bingo.entity';

export type FindBingoByIdResult = Bingo;

export class FindBingoByIdQuery extends Query<FindBingoByIdResult> {
  public readonly bingoId: number;
  constructor(bingoId: number) {
    super();
    this.bingoId = bingoId;
  }
}
