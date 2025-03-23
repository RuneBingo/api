import { Query, QueryBus, QueryHandler } from '@nestjs/cqrs';

import {
  resolvePaginatedQueryWithoutTotal,
  type PaginatedQueryParams,
  type PaginatedResultWithoutTotal,
} from '@/db/paginated-query.utils';
import { type User } from '@/user/user.entity';

import { Bingo } from '../bingo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetBingoParticipantsQuery } from '@/bingo-participant/queries/get-bingo-participants.query';
import { UnauthorizedException } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { I18nTranslations } from '@/i18n/types';

export type SearchBingosParams = PaginatedQueryParams<{
  requester: User | undefined;
}>;

export type SearchBingosResult = PaginatedResultWithoutTotal<Bingo>;

export class SearchBingosQuery extends Query<SearchBingosResult> {
  constructor(public readonly params: SearchBingosParams) {
    super();
  }
}

@QueryHandler(SearchBingosQuery)
export class SearchBingosHandler {
  constructor(
    @InjectRepository(Bingo)
    private readonly bingoRepository: Repository<Bingo>,
    private readonly queryBus: QueryBus,
    private readonly i18nService: I18nService<I18nTranslations>,
  ) {}

  async execute(query: SearchBingosQuery): Promise<SearchBingosResult> {
    const { requester, ...pagination } = query.params;

    const bingos = this.bingoRepository.createQueryBuilder('bingo');

    if (!requester) {
      bingos.where('bingo.private = false');
    } else {
      bingos.leftJoin('bingo_participant', 'bingoParticipant', 'bingoParticipant.bingo_id = bingo.id');
      bingos.where(
        '(bingo.private = false OR bingoParticipant.user_id = :requesterId OR :requesterRole IN (:...roles))',
        { requesterId: requester.id, roles: ['moderator', 'admin'], requesterRole: requester.role },
      );
    }

    return resolvePaginatedQueryWithoutTotal(bingos, pagination);
  }
}
