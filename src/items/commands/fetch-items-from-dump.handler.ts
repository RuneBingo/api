import { CommandHandler } from '@nestjs/cqrs';
import { FetchItemsFromDumpCommand } from './fetch-items-from-dump.command';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from '../entities/item.entity';
import { Repository } from 'typeorm';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@CommandHandler(FetchItemsFromDumpCommand)
export class FetchItemsFromDumpHandler {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
    private readonly configService: ConfigService
  ) {}

  private itemListUrl = 'https://chisel.weirdgloop.org/gazproj/gazbot/os_dump.json';
  private readonly logger = new Logger(FetchItemsFromDumpHandler.name);

  async execute(command: FetchItemsFromDumpCommand): Promise<void> {
    try {
      const response = await fetch(this.itemListUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch item list');
      }

      const responseObject: object = await response.json();
      const items: Item[] = Object.values(responseObject);

      const validItems = items.filter((item) => item.id !== null && item.id !== undefined);
      const invalidItems = items.filter((item) => item.id === null || item.id === undefined);

      if (this.configService.get('NODE_ENV') === 'development') {
        if (invalidItems.length > 0) {
          this.logger.error('Invalid items: ', invalidItems);
        }

        this.logger.log(`Imported ${validItems.length} items`);
      }
      await this.itemRepository.save(validItems);
    } catch (error) {
      this.logger.error('Error: ', error);
    }
  }
}
