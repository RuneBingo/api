import { type Item } from '../entities/item.entity';

export class ItemDto {
  constructor(item: Item) {
    this.id = item.id;
    this.name = item.name;
  }

  id: number;
  name: string;
}
