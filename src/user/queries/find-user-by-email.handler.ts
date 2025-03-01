import { QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FindUserByEmailQuery, type FindUserByEmailResult } from './find-user-by-email.query';
import { User } from '../user.entity';

@QueryHandler(FindUserByEmailQuery)
export class FindUserByEmailHandler {
  constructor(@InjectRepository(User) private readonly repository: Repository<User>) {}

  async execute(query: FindUserByEmailQuery): Promise<FindUserByEmailResult> {
    const { email, withDeleted } = query;

    const emailNormalized = User.normalizeEmail(email);
    return this.repository.findOne({ where: { emailNormalized }, withDeleted });
  }
}
