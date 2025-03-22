import { Activity } from '@/activity/activity.entity';
import { PaginatedDtoWithoutTotal } from '@/db/dto/paginated.dto';
import { PaginatedQueryParams } from '@/db/paginated-query.utils';
import { User } from '@/user/user.entity';
import { Query } from '@nestjs/cqrs';

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
