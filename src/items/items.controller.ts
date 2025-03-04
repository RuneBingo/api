import { Controller, Get, Post, Body, Patch, Param, Delete, Query} from '@nestjs/common';

import { ItemsService } from './items.service';
import { Item } from './entities/item.entity';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
  async findAll() {
    return this.itemsService.findAll();
  }

  @Get('search')
  async searchItems(@Query('searchTerm') searchTerm: string): Promise<Item[]> {
    return this.itemsService.findByPartialName(searchTerm);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Item | null> {
    return this.itemsService.findOne(+id);
  }
}
