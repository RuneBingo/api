import { CommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AddBingoParticipantCommand, AddBingoParticipantResult } from './add-bingo-participant.command';
import { BingoParticipant } from '../bingo-participant.entity';

@CommandHandler(AddBingoParticipantCommand)
export class AddBingoParticipantHandler {
  constructor(
    @InjectRepository(BingoParticipant)
    private readonly bingoParticipantRepository: Repository<BingoParticipant>,
  ) {}

  async execute(command: AddBingoParticipantCommand): Promise<AddBingoParticipantResult> {
    const { bingo, user, role } = command.params;

    const bingoParticipant: BingoParticipant = new BingoParticipant();
    bingoParticipant.userId = user.id;
    bingoParticipant.bingoId = bingo.id;
    bingoParticipant.role = role;

    await this.bingoParticipantRepository.save(bingoParticipant);

    return bingoParticipant;
  }
}
