import { Query } from '@nestjs/cqrs';

import { type PaginatedQueryParams, type PaginatedResultWithoutTotal } from '@/db/paginated-query.utils';

import { type Bingo } from '../bingo.entity';

export type SearchBingosParams = PaginatedQueryParams<object>;

export type SearchBingosResult = PaginatedResultWithoutTotal<Bingo>;

export class SearchBingosQuery extends Query<SearchBingosResult> {
  constructor(public readonly params: SearchBingosParams) {
    super();
  }
}
