import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

//TODO: [RB-17] Change this command to an async task
//import { FetchItemsFromDumpCommand } from './commands/fetch-items-from-dump.command';
import { FetchItemsFromDumpHandler } from './commands/fetch-items-from-dump.handler';
import { Item } from './entities/item.entity';
import { ItemsController } from './items.controller';
import { FindItemByIdHandler } from './queries/find-item-by-id.handler';
import { SearchItemsByNameHandler } from './queries/search-items-by-name.handler';

@Module({
  imports: [TypeOrmModule.forFeature([Item])],
  controllers: [ItemsController],
  providers: [SearchItemsByNameHandler, FindItemByIdHandler, FetchItemsFromDumpHandler],
})
export class ItemsModule implements OnApplicationBootstrap {
  constructor(private readonly commandBus: CommandBus) {}

  async onApplicationBootstrap() {
    //TODO: [RB-17] Change this command to an async task
    //await this.commandBus.execute(new FetchItemsFromDumpCommand());
  }
}
