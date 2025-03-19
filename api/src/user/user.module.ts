import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CreateUserHandler } from './commands/create-user.handler';
import { UserCreatedHandler } from './events/user-created.handler';
import { FindUserByEmailHandler } from './queries/find-user-by-email.handler';
import { SearchUsersHandler } from './queries/search-users.handler';
import { UserController } from './user.controller';
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
    SearchUsersHandler,
  ],
  controllers: [UserController],
})
export class UserModule {}
