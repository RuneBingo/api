import { Query } from '@nestjs/cqrs';

export type VerifyEmailCodeResult = {
  valid: boolean;
};

export class VerifyEmailCodeQuery extends Query<VerifyEmailCodeResult> {
  constructor(
    public readonly email: string,
    public readonly code: string,
  ) {
    super();
  }
}
