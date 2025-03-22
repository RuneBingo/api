import { Command } from '@nestjs/cqrs';

import { type User } from '@/user/user.entity';

import { type Bingo } from '../bingo.entity';
import { type CreateBingoDto } from '../dto/create-bingo.dto';

export type CreateBingoParams = {
  requester: User;
  createBingoDto: CreateBingoDto;
};

export type CreateBingoResult = Bingo;

export class CreateBingoCommand extends Command<Bingo> {
  public readonly requester: User;
  public readonly createBingoDto: CreateBingoDto;
  constructor({ requester, createBingoDto }: CreateBingoParams) {
    super();
    this.requester = requester;
    this.createBingoDto = createBingoDto;
  }
}
