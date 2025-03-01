import { Query } from '@nestjs/cqrs';

import { type User } from '../user.entity';

export type FindUserByEmailParams = {
  email: string;
  withDeleted?: boolean;
};

export type FindUserByEmailResult = User | null;

export class FindUserByEmailQuery extends Query<FindUserByEmailResult> {
  public readonly email: string;
  public readonly withDeleted: boolean;

  constructor({ email, withDeleted = false }: FindUserByEmailParams) {
    super();

    this.email = email;
    this.withDeleted = withDeleted;
  }
}
