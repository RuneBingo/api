import { type ICommand } from '@nestjs/cqrs';

export class FetchItemsFromDumpCommand implements ICommand {
  constructor() {}
}
