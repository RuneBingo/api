import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CreateUserHandler } from './commands/create-user.handler';
import { UserCreatedHandler } from './events/user-created.handler';
import { FindUserByEmailHandler } from './queries/find-user-by-email.handler';
import { User } from './user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    // Commands
    CreateUserHandler,
    // Events
    UserCreatedHandler,
    // Queries
    FindUserByEmailHandler,
  ],
})
export class UserModule {}
