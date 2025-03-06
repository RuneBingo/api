import { ApiProperty } from '@nestjs/swagger';

import { type Item } from '../entities/item.entity';

export class ItemDto {
  constructor(item: Item) {
    this.id = item.id;
    this.name = item.name;
  }
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
}
