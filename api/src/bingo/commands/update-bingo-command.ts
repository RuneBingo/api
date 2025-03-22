import { Command } from '@nestjs/cqrs';

import { type User } from '@/user/user.entity';

import { type Bingo } from '../bingo.entity';
import { type UpdateBingoDto } from '../dto/update-bingo.dto';

export type UpdateBingoParams = {
  requester: User;
  bingoId: number;
  updateBingoDto: UpdateBingoDto;
};

export type UpdateBingoResult = Bingo;

export class UpdateBingoCommand extends Command<Bingo> {
  constructor(public readonly params: UpdateBingoParams) {
    super();
  }
}
