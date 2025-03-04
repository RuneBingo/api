import { Query } from '@nestjs/cqrs';

import { ItemDto } from '../dtos/item.dto';

export type GetItemByIdResult = {
  item: ItemDto | null;
};

export class GetItemByIdQuery extends Query<GetItemByIdResult> {
  constructor(public readonly id: number) {
    super();
  }
}
