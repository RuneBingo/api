import { BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Command, QueryBus, CommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { I18nService } from 'nestjs-i18n';
import { Repository } from 'typeorm';

import { Roles } from '@/auth/roles/roles.constants';
import { userHasRole } from '@/auth/roles/roles.utils';
import { GetBingoParticipantsQuery } from '@/bingo-participant/queries/get-bingo-participants.query';
import { I18nTranslations } from '@/i18n/types';
import { type User } from '@/user/user.entity';

import { Bingo } from '../bingo.entity';

export type UpdateBingoParams = {
  bingoId: number;
  requester: User;
  updates: {
    language?: string;
    title?: string;
    description?: string;
    isPrivate?: boolean;
    width?: number;
    height?: number;
    fullLineValue?: number;
    startDate?: Date;
    endDate?: Date;
  };
};

export type UpdateBingoResult = Bingo;

export class UpdateBingoCommand extends Command<Bingo> {
  public readonly bingoId: number;
  public readonly requester: User;
  public readonly updates: {
    language?: string;
    title?: string;
    description?: string;
    isPrivate?: boolean;
    width?: number;
    height?: number;
    fullLineValue?: number;
    startDate?: Date;
    endDate?: Date;
  };
  constructor({ bingoId, requester, updates }: UpdateBingoParams) {
    super();
    this.bingoId = bingoId;
    this.requester = requester;
    this.updates = updates;
  }
}

@CommandHandler(UpdateBingoCommand)
export class UpdateBingoHandler {
  constructor(
    @InjectRepository(Bingo)
    private readonly bingoRepository: Repository<Bingo>,
    private readonly i18nService: I18nService<I18nTranslations>,
    private readonly queryBus: QueryBus,
  ) {}

  async execute(command: UpdateBingoCommand): Promise<UpdateBingoResult> {
    const { bingoId, requester } = command;

    let bingo = await this.bingoRepository.findOneBy({ id: bingoId });

    if (!bingo) {
      throw new NotFoundException(this.i18nService.t('bingo.updateBingo.bingoNotFound'));
    }

    const bingoParticipants = await this.queryBus.execute(new GetBingoParticipantsQuery({ bingoId: bingo.id }));

    const participant = bingoParticipants.find((participant) => {
      return participant.userId === requester.id;
    });

    const requesterIsModerator = userHasRole(requester, Roles.Moderator);

    if (!requesterIsModerator && !participant) {
      throw new UnauthorizedException(this.i18nService.t('bingo.updateBingo.notAuthorized'));
    }

    if (!requesterIsModerator && bingo.startedAt) {
      throw new BadRequestException(this.i18nService.t('bingo.updateBingo.bingoNotPending'));
    }

    const updates = Object.fromEntries(
      Object.entries(command.updates).filter(([key, value]) => value !== undefined && value !== bingo![key]),
    ) as UpdateBingoParams['updates'];

    if (updates.description) {
      bingo.description = updates.description;
    }

    if (updates.startDate) {
      bingo.startDate = updates.startDate;
    }

    if (updates.endDate) {
      bingo.endDate = updates.endDate;
    }

    if (updates.language) {
      bingo.language = updates.language;
    }

    if (updates.isPrivate) {
      bingo.private = updates.isPrivate;
    }

    if (updates.title) {
      bingo.title = updates.title;
    }

    if (updates.fullLineValue) {
      bingo.fullLineValue = updates.fullLineValue;
    }

    bingo = await this.bingoRepository.save(bingo);

    return bingo;
  }
}
