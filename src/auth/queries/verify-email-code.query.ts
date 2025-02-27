import { Query } from '@nestjs/cqrs';

export class VerifyEmailCode extends Query<boolean> {
  constructor(
    public readonly email: string,
    public readonly code: string,
  ) {
    super();
  }
}
