import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { Item } from './entities/item.entity';

@Injectable()
export class ItemsService implements OnModuleInit {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
  ) {}

  private itemListUrl = 'https://chisel.weirdgloop.org/gazproj/gazbot/os_dump.json';

  async importItemList() {
    try {
      const response = await fetch(this.itemListUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch item list');
      }

      const responseObject: object = await response.json();
      const items: Item[] = Object.values(responseObject);

      const validItems = items.filter((item) => item.id !== null && item.id !== undefined);
      const invalidItems = items.filter((item) => item.id === null || item.id === undefined);
      if (invalidItems.length > 0) {
        console.error('Invalid items: ', invalidItems);
      }

      await this.itemRepository.save(validItems);
    } catch (error) {
      console.error('Error: ', error);
    }
  }

  async onModuleInit() {
    //await this.importItemList();
  }

  async findAll() {
    return await this.itemRepository.find();
  }

  async findOne(id: number): Promise<Item | null> {
    return await this.itemRepository.findOneBy({id: id});
  }

  async findByPartialName(searchTerm: string): Promise<Item[]> {
    return await this.itemRepository.find({
      where: {
        name: ILike(`%${searchTerm}%`),
      },
    });
  }
}
