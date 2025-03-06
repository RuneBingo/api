import { Query } from '@nestjs/cqrs';

import { type Item } from '../entities/item.entity';

export type FindItemByIdResult = {
  item: Item | null;
};

export class FindItemByIdQuery extends Query<FindItemByIdResult> {
  constructor(public readonly id: number) {
    super();
  }
}
