import { QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { GetItemsByNamePartialQuery, GetItemsByNamePartialResult } from './get-items-by-name-partial.query';
import { ItemDto } from '../dtos/item.dto';
import { Item } from '../entities/item.entity';

@QueryHandler(GetItemsByNamePartialQuery)
export class GetItemsByNamePartialHandler {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
  ) {}

  async execute(query: GetItemsByNamePartialQuery): Promise<GetItemsByNamePartialResult> {
    const { searchTerm } = query;

    const items: Item[] = await this.itemRepository.find({
      where: {
        name: ILike(`%${searchTerm}%`),
      },
    });

    const itemDtos: ItemDto[] = items.map((item) => new ItemDto(item));

    return { items: itemDtos };
  }
}
