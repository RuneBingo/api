import { Query } from '@nestjs/cqrs';

import { type Item } from '../entities/item.entity';

export type GetItemByIdResult = {
  item: Item | null;
};

export class GetItemByIdQuery extends Query<GetItemByIdResult> {
  constructor(public readonly id: number) {
    super();
  }
}
