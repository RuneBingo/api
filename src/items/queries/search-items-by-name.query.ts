import { Query } from '@nestjs/cqrs';

import { type Item } from '../entities/item.entity';

export type SearchItemsByNameResult = {
  items: Item[];
};

export class SearchItemsByNameQuery extends Query<SearchItemsByNameResult> {
  constructor(public readonly searchTerm: string) {
    super();
  }
}
