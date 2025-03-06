import { QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { SearchItemsByNameQuery, SearchItemsByNameResult } from './search-items-by-name.query';
import { Item } from '../entities/item.entity';

@QueryHandler(SearchItemsByNameQuery)
export class SearchItemsByNameHandler {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
  ) {}

  async execute(query: SearchItemsByNameQuery): Promise<SearchItemsByNameResult> {
    const { searchTerm } = query;

    const items: Item[] = await this.itemRepository.find({
      where: {
        name: ILike(`%${searchTerm}%`),
      },
    });

    return { items: items };
  }
}
