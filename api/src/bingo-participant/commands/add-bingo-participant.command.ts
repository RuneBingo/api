import { Command } from '@nestjs/cqrs';

import { type Bingo } from '@/bingo/bingo.entity';
import { type User } from '@/user/user.entity';

import { type BingoParticipant } from '../bingo-participant.entity';

export type AddBingoParticipantParams = {
  bingo: Bingo;
  user: User;
  role: string;
};

export type AddBingoParticipantResult = BingoParticipant;

export class AddBingoParticipantCommand extends Command<BingoParticipant> {
  constructor(public readonly params: AddBingoParticipantParams) {
    super();
  }
}
