import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpCode, NotFoundException } from '@nestjs/common';

import { Item } from './entities/item.entity';
import { QueryBus } from '@nestjs/cqrs';
import { GetItemsByNamePartialQuery, GetItemsByNamePartialResult } from './queries/get-items-by-name-partial.query';
import { GetItemByIdQuery } from './queries/get-item-by-id.query';
import { ApiNotFoundResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('items')
export class ItemsController {
  constructor(
    private readonly queryBus: QueryBus
  ) {}

  @Get('search')
  @ApiOperation({summary: 'Returns an array of items that partially match the search term'})
  @ApiResponse({status: 200, description: 'Array of items that partially matches search term'})
  async searchItems(@Query('searchTerm') searchTerm: string): Promise<Item[]> {
    const { items } = await this.queryBus.execute(new GetItemsByNamePartialQuery(searchTerm));
  
    return items;
  }

  @Get(':id')
  @ApiOperation({summary: 'Returns an item with the id entered or 404'})
  @ApiResponse({status: 200, description: 'Item was found'})
  @ApiNotFoundResponse({description: 'Item was not found'})
  async findOne(@Param('id') id: string): Promise<Item | null> {
    const { item } = await this.queryBus.execute(new GetItemByIdQuery(+id))

    if (!item) {
      throw new NotFoundException(`Item with id ${id} was not found`);
    }

    return item;
  }
}
