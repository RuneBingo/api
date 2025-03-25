import { BadRequestException, ForbiddenException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Command, QueryBus, CommandHandler, EventBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { I18nService } from 'nestjs-i18n';
import { Repository } from 'typeorm';

import { Roles } from '@/auth/roles/roles.constants';
import { userHasRole } from '@/auth/roles/roles.utils';
import { GetBingoParticipantsQuery } from '@/bingo-participant/queries/get-bingo-participants.query';
import { I18nTranslations } from '@/i18n/types';
import { type User } from '@/user/user.entity';

import { Bingo } from '../bingo.entity';
import { slugifyTitle } from '../bingo.util';
import { BingoUpdatedEvent } from '../events/bingo-updated.event';
import { BingoPolicies } from '../bingo.policies';

export type UpdateBingoParams = {
  bingoId: number;
  requester: User;
  updates: {
    language?: string;
    title?: string;
    description?: string;
    private?: boolean;
    width?: number;
    height?: number;
    fullLineValue?: number;
    startDate?: string;
    endDate?: string;
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
    private?: boolean;
    width?: number;
    height?: number;
    fullLineValue?: number;
    startDate?: string;
    endDate?: string;
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
    private readonly eventBus: EventBus,
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

    if (!new BingoPolicies(requester).canUpdate(participant, bingo)) {
      throw new ForbiddenException(this.i18nService.t('bingo.updateBingo.forbidden'))
    }

    const updates = Object.fromEntries(
      Object.entries(command.updates).filter(([key, value]) => {
        const current = bingo![key as keyof Bingo];

        if (value === undefined) return false;

        return value !== current;
      }),
    ) as UpdateBingoParams['updates'];

    if (Object.keys(updates).length === 0) {
      return bingo;
    }

    Object.assign(bingo, updates);

    if (updates.title) {
      const titleSlug = slugifyTitle(updates.title);

      const existingBingo = await this.bingoRepository.findOneBy({ slug: titleSlug });

      if (existingBingo) {
        throw new BadRequestException(this.i18nService.t('bingo.updateBingo.titleNotUnique'));
      }
      bingo.slug = titleSlug;
      console.log('Slug', titleSlug);
    }

    this.eventBus.publish(
      new BingoUpdatedEvent({
        bingoId: bingoId,
        requesterId: command.requester.id,
        updates,
      }),
    );

    bingo.updatedById = requester.id;
    bingo.updatedBy = Promise.resolve(requester);

    bingo = await this.bingoRepository.save(bingo);

    return bingo;
  }
}
