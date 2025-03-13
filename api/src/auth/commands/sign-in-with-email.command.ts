import { Command } from '@nestjs/cqrs';

export type SignInWithEmailResult = {
  code: string;
};

export class SignInWithEmailCommand extends Command<SignInWithEmailResult> {
  constructor(public readonly email: string) {
    super();
  }
}
