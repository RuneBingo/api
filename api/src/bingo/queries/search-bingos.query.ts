import { Query } from '@nestjs/cqrs';

import { type PaginatedQueryParams, type PaginatedResultWithoutTotal } from '@/db/paginated-query.utils';

import { type Bingo } from '../bingo.entity';
import { User } from '@/user/user.entity';

export type SearchBingosParams = PaginatedQueryParams<{
  requester: User | undefined;
}>;

export type SearchBingosResult = PaginatedResultWithoutTotal<Bingo>;

export class SearchBingosQuery extends Query<SearchBingosResult> {
  constructor(public readonly params: SearchBingosParams) {
    super();
  }
}
