import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FetchItemsFromDumpCommand } from './commands/fetch-items-from-dump.command';
import { FetchItemsFromDumpHandler } from './commands/fetch-items-from-dump.handler';
import { Item } from './entities/item.entity';
import { ItemsController } from './items.controller';
import { GetItemByIdHandler } from './queries/get-item-by-id.handler';
import { GetItemsByNamePartialHandler } from './queries/get-items-by-name-partial.handler';

@Module({
  imports: [TypeOrmModule.forFeature([Item])],
  controllers: [ItemsController],
  providers: [GetItemsByNamePartialHandler, GetItemByIdHandler, FetchItemsFromDumpHandler],
})
export class ItemsModule implements OnApplicationBootstrap {
  constructor(private readonly commandBus: CommandBus) {}

  async onApplicationBootstrap() {
    await this.commandBus.execute(new FetchItemsFromDumpCommand());
  }
}
