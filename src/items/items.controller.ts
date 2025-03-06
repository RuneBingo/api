import { Controller, Get, Param, Query, NotFoundException } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiNotFoundResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { ItemDto } from './dtos/item.dto';
import { FindItemByIdQuery } from './queries/find-item-by-id.query';
import { SearchItemsByNameQuery } from './queries/search-items-by-name.query';

@Controller('items')
export class ItemsController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('search')
  @ApiOperation({ summary: 'Returns an array of items that partially match the search term' })
  @ApiResponse({ status: 200, description: 'Array of items that partially matches search term' })
  async searchItems(@Query('searchTerm') searchTerm: string): Promise<ItemDto[]> {
    const { items } = await this.queryBus.execute(new SearchItemsByNameQuery(searchTerm));

    return items.map((item) => new ItemDto(item));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Returns an item with the id entered or 404' })
  @ApiResponse({ status: 200, description: 'Item was found' })
  @ApiNotFoundResponse({ description: 'Item was not found' })
  async findOne(@Param('id') id: number): Promise<ItemDto | null> {
    const { item } = await this.queryBus.execute(new FindItemByIdQuery(id));

    if (!item) {
      throw new NotFoundException(`Item with id ${id} was not found`);
    }

    return new ItemDto(item);
  }
}
