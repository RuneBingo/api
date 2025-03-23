import { Query, QueryHandler } from '@nestjs/cqrs';

import { Activity } from '@/activity/activity.entity';
import { type PaginatedDtoWithoutTotal } from '@/db/dto/paginated.dto';
import { resolvePaginatedQueryWithoutTotal, type PaginatedQueryParams } from '@/db/paginated-query.utils';
import { type User } from '@/user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bingo } from '../bingo.entity';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from '@/i18n/types';
import { NotFoundException } from '@nestjs/common';

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
      .leftJoin('bingo_participant', 'bingoParticipant', 'bingoParticipant.bingo_id = activity.trackable_id')
      .where('activity.trackable_type = :type', { type: 'Bingo' })
      .andWhere('activity.trackable_id = :id', { id: bingo.id })
      .andWhere('(bingoParticipant.role = :organizer OR bingoParticipant.role = :owner)', {organizer: 'Organizer', owner: 'Owner'})
      .orderBy('activity.created_at', 'DESC');

    return resolvePaginatedQueryWithoutTotal(q, pagination);
  }
}