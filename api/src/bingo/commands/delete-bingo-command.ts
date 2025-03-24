import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Command, CommandHandler, QueryBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { I18nService } from 'nestjs-i18n';
import { Repository } from 'typeorm';

import { Roles } from '@/auth/roles/roles.constants';
import { userHasRole } from '@/auth/roles/roles.utils';
import { GetBingoParticipantsQuery } from '@/bingo-participant/queries/get-bingo-participants.query';
import { I18nTranslations } from '@/i18n/types';
import { User } from '@/user/user.entity';

import { Bingo } from '../bingo.entity';
import { userHasBingoRole } from '@/bingo-participant/roles/bingo-roles.utils';
import { BingoRoles } from '@/bingo-participant/roles/bingo-roles.constants';

export type DeleteBingoParams = {
  requester: User;
  bingoId: number;
};

export type DeleteBingoResult = Bingo;

export class DeleteBingoCommand extends Command<DeleteBingoResult> {
  constructor(public readonly params: DeleteBingoParams) {
    super();
  }
}

@CommandHandler(DeleteBingoCommand)
export class DeleteBingoHandler {
  constructor(
    @InjectRepository(Bingo)
    private readonly bingoRepository: Repository<Bingo>,
    private readonly i18nService: I18nService<I18nTranslations>,
    private readonly queryBus: QueryBus,
  ) {}

  async execute(command: DeleteBingoCommand): Promise<DeleteBingoResult> {
    const { requester, bingoId } = command.params;

    const bingo = await this.bingoRepository.findOneBy({ id: bingoId });

    if (!bingo) {
      throw new NotFoundException(this.i18nService.t('bingo.deleteBingo.bingoNotFound'));
    }

    const bingoParticipants = await this.queryBus.execute(new GetBingoParticipantsQuery({ bingoId: bingoId }));

    const participant = bingoParticipants.find((participant) => {
      return participant.userId === requester.id;
    });

    const requesterIsModerator = userHasRole(requester, Roles.Moderator);

    if (!requesterIsModerator && (!participant || !userHasBingoRole(participant, BingoRoles.Owner))) {
      throw new UnauthorizedException(this.i18nService.t('bingo.deleteBingo.notAuthorized'));
    }

    bingo.deletedAt = new Date();
    bingo.deletedById = requester.id;

    return await this.bingoRepository.save(bingo);
  }
}
