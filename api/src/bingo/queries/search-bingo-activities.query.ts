import { Query } from '@nestjs/cqrs';

import { type Activity } from '@/activity/activity.entity';
import { type PaginatedDtoWithoutTotal } from '@/db/dto/paginated.dto';
import { type PaginatedQueryParams } from '@/db/paginated-query.utils';
import { type User } from '@/user/user.entity';

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
