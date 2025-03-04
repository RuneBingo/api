import { QueryHandler } from '@nestjs/cqrs';
import { GetItemsByNamePartialQuery, GetItemsByNamePartialResult } from './get-items-by-name-partial.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from '../entities/item.entity';
import { ILike, Repository } from 'typeorm';

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

    return { items };
  }
}
