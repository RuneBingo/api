import { QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { GetItemByIdResult, GetItemByIdQuery } from './get-item-by-id.query';
import { Item } from '../entities/item.entity';
import { ItemDto } from '../dtos/item.dto';

@QueryHandler(GetItemByIdQuery)
export class GetItemByIdHandler {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
  ) {}

  async execute(query: GetItemByIdQuery): Promise<GetItemByIdResult> {
    const { id } = query;

    const item: Item | null = await this.itemRepository.findOneBy({ id: id });

    if (!item) {
      return { item };
    }

    return { item: new ItemDto(item) };
  }
}
