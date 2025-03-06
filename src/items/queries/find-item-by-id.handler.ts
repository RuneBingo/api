import { QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FindItemByIdResult, FindItemByIdQuery } from './find-item-by-id.query';
import { Item } from '../entities/item.entity';

@QueryHandler(FindItemByIdQuery)
export class FindItemByIdHandler {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
  ) {}

  async execute(query: FindItemByIdQuery): Promise<FindItemByIdResult> {
    const { id } = query;

    const item: Item | null = await this.itemRepository.findOneBy({ id: id });

    return { item: item };
  }
}
