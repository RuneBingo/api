import { Query } from '@nestjs/cqrs';

import { type ItemDto } from '../dtos/item.dto';

export type GetItemsByNamePartialResult = {
  items: ItemDto[];
};

export class GetItemsByNamePartialQuery extends Query<GetItemsByNamePartialResult> {
  constructor(public readonly searchTerm: string) {
    super();
  }
}
