import { QueryHandler } from '@nestjs/cqrs';
import { GetItemsByNamePartialQuery, GetItemsByNamePartialResult } from './get-items-by-name-partial.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from '../entities/item.entity';
import { ILike, Repository } from 'typeorm';
import { GetItemByIdResult, GetItemByIdQuery } from './get-item-by-id.query';

@QueryHandler(GetItemByIdQuery)
export class GetItemByIdHandler {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
  ) {}

  async execute(query: GetItemByIdQuery): Promise<GetItemByIdResult> {
    const { id } = query;

    const item: Item | null = await this.itemRepository.findOneBy({ id: id });

    return { item };
  }
}
