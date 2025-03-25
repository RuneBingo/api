import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Query, QueryBus, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { I18nService } from 'nestjs-i18n';
import { Repository } from 'typeorm';

import { Activity } from '@/activity/activity.entity';
import { GetBingoParticipantsQuery } from '@/bingo-participant/queries/get-bingo-participants.query';
import { type PaginatedDtoWithoutTotal } from '@/db/dto/paginated.dto';
import { resolvePaginatedQueryWithoutTotal, type PaginatedQueryParams } from '@/db/paginated-query.utils';
import { I18nTranslations } from '@/i18n/types';
import { type User } from '@/user/user.entity';

import { Bingo } from '../bingo.entity';
import { BingoPolicies } from '../bingo.policies';

export type SearchBingoActivitiesParams = PaginatedQueryParams<{
  requester: User;
  bingoId: number;
}>;

export type SearchBingoActivitiesResult = PaginatedDtoWithoutTotal<Activity>;

export class SearchBingoActivitiesQuery extends Query<SearchBingoActivitiesResult> {
  constructor(public readonly params: SearchBingoActivitiesParams) {
    super();
  }
}

@QueryHandler(SearchBingoActivitiesQuery)
export class SearchBingoActivitiesHandler {
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
    @InjectRepository(Bingo)
    private readonly bingoRepository: Repository<Bingo>,
    private readonly i18nService: I18nService<I18nTranslations>,
    private readonly queryBus: QueryBus,
  ) {}

  async execute(query: SearchBingoActivitiesQuery): Promise<SearchBingoActivitiesResult> {
    const { requester, bingoId, ...pagination } = query.params;

    const bingo = await this.bingoRepository.findOneBy({ id: bingoId });

    if (!bingo) {
      throw new NotFoundException(this.i18nService.t('bingo.searchBingoActivities.bingoNotFound'));
    }

    const bingoParticipants = await this.queryBus.execute(new GetBingoParticipantsQuery({ bingoId: bingoId }));

    const participant = bingoParticipants.find((participant) => {
      return participant.userId === requester.id;
    });

    if (!new BingoPolicies(requester).canViewActivities(participant)) {
      throw new ForbiddenException(this.i18nService.t('bingo.activity.forbidden'));
    }

    const q = this.activityRepository
      .createQueryBuilder('activity')
      .where('activity.trackable_id = :trackableId AND activity.key LIKE :keyPrefix ', {
        trackableId: bingoId,
        keyPrefix: 'bingo%',
      })
      .orderBy('activity.createdAt', 'DESC');

    return resolvePaginatedQueryWithoutTotal(q, pagination);
  }
}
