import { NotFoundException } from '@nestjs/common';
import { Query, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { I18nService } from 'nestjs-i18n';
import { Brackets, Repository } from 'typeorm';

import { Activity } from '@/activity/activity.entity';
import { type PaginatedDtoWithoutTotal } from '@/db/dto/paginated.dto';
import { resolvePaginatedQueryWithoutTotal, type PaginatedQueryParams } from '@/db/paginated-query.utils';
import { I18nTranslations } from '@/i18n/types';
import { type User } from '@/user/user.entity';

import { Bingo } from '../bingo.entity';

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
  ) {}

  async execute(query: SearchBingoActivitiesQuery): Promise<SearchBingoActivitiesResult> {
    const { requester, bingoId, ...pagination } = query.params;

    const bingo = await this.bingoRepository.findOneBy({ id: bingoId });

    if (!bingo) {
      throw new NotFoundException(this.i18nService.t('bingo.searchBingoActivities.bingoNotFound'));
    }

    const q = this.activityRepository
      .createQueryBuilder('activity')
      .innerJoin('bingo_participant', 'bingoParticipant', 'bingoParticipant.bingo_id = activity.trackable_id')
      .innerJoin('user', 'user', 'user.id = bingoParticipant.user_id')
      .where('activity.trackable_id = :trackableId', { trackableId: bingoId })
      .andWhere('(bingoParticipant.role IN (:...bingoRoles) OR user.role IN (:...roles))', {
        roles: ['admin', 'moderator'],
        bingoRoles: ['organizer', 'owner']
      })
      .orderBy('activity.createdAt', 'DESC');

    return resolvePaginatedQueryWithoutTotal(q, pagination);
  }
}
