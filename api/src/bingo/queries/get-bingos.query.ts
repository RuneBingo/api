import { Query } from '@nestjs/cqrs';

import { type PaginatedQueryParams, type PaginatedResultWithoutTotal } from '@/db/paginated-query.utils';

import { type Bingo } from '../bingo.entity';

export type GetBingosParams = PaginatedQueryParams<object>;

export type GetBingosResult = PaginatedResultWithoutTotal<Bingo>;

export class GetBingosQuery extends Query<GetBingosResult> {
  constructor(public readonly params: GetBingosParams) {
    super();
  }
}
