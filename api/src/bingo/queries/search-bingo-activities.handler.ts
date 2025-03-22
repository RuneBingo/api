import { NotFoundException } from '@nestjs/common';
import { QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { I18nService } from 'nestjs-i18n';
import { Repository } from 'typeorm';

import { Activity } from '@/activity/activity.entity';
import { resolvePaginatedQueryWithoutTotal } from '@/db/paginated-query.utils';
import { I18nTranslations } from '@/i18n/types';

import { SearchBingoActivitiesQuery, SearchBingoActivitiesResult } from './search-bingo-activities.query';
import { Bingo } from '../bingo.entity';

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
      .where('activity.trackable_type = :type', { type: 'Bingo' })
      .andWhere('activity.trackable_id = :id', { id: bingo.id })
      .orderBy('activity.created_at', 'DESC');

    return resolvePaginatedQueryWithoutTotal(q, pagination);
  }
}
