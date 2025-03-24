import { BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Command, CommandHandler, EventBus, QueryBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { I18nService } from 'nestjs-i18n';
import { Repository } from 'typeorm';

import { Roles } from '@/auth/roles/roles.constants';
import { userHasRole } from '@/auth/roles/roles.utils';
import { GetBingoParticipantsQuery } from '@/bingo-participant/queries/get-bingo-participants.query';
import { I18nTranslations } from '@/i18n/types';
import { User } from '@/user/user.entity';

import { Bingo } from '../bingo.entity';
import { BingoCanceledEvent } from '../events/bingo-canceled-event';

export type CancelBingoParams = {
  requester: User;
  bingoId: number;
};

export type CancelBingoResult = Bingo;

export class CancelBingoCommand extends Command<Bingo> {
  constructor(public readonly params: CancelBingoParams) {
    super();
  }
}

@CommandHandler(CancelBingoCommand)
export class CancelBingoHandler {
  constructor(
    @InjectRepository(Bingo)
    private readonly bingoRepository: Repository<Bingo>,
    private readonly i18nService: I18nService<I18nTranslations>,
    private readonly queryBus: QueryBus,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CancelBingoCommand): Promise<Bingo> {
    const { requester, bingoId } = command.params;

    const bingo = await this.bingoRepository.findOneBy({ id: bingoId });

    if (!bingo) {
      throw new NotFoundException(this.i18nService.t('bingo.deleteBingo.bingoNotFound'));
    }

    if (bingo.canceledAt || bingo.endedAt) {
      throw new BadRequestException(this.i18nService.t('bingo.cancelBingo.alreadyEndedOrCanceled'));
    }

    const bingoParticipants = await this.queryBus.execute(new GetBingoParticipantsQuery({ bingoId: bingoId }));

    const participant = bingoParticipants.find((participant) => {
      return participant.userId === requester.id;
    });

    const requesterIsModerator = userHasRole(requester, Roles.Moderator);

    if (!requesterIsModerator && (!participant || (participant.role !== 'owner' && participant.role !== 'organizer'))) {
      throw new UnauthorizedException(this.i18nService.t('bingo.deleteBingo.notAuthorized'));
    }

    bingo.canceledAt = new Date();
    bingo.canceledById = requester.id;
    bingo.canceledBy = Promise.resolve(requester);

    const canceledBingo = await this.bingoRepository.save(bingo);

    this.eventBus.publish(new BingoCanceledEvent({ bingoId, requesterId: requester.id }));

    return canceledBingo;
  }
}
