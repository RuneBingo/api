import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';

import { Item } from './entities/item.entity';
import { QueryBus } from '@nestjs/cqrs';
import { GetItemsByNamePartialQuery, GetItemsByNamePartialResult } from './queries/get-items-by-name-partial.query';
import { GetItemByIdQuery } from './queries/get-item-by-id.query';

@Controller('items')
export class ItemsController {
  constructor(
    private readonly queryBus: QueryBus
  ) {}

  @Get('search')
  async searchItems(@Query('searchTerm') searchTerm: string): Promise<Item[]> {
    const { items } = await this.queryBus.execute(new GetItemsByNamePartialQuery(searchTerm));
  
    return items;
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Item | null> {
    const { item } = await this.queryBus.execute(new GetItemByIdQuery(+id))

    return item;
  }
}
