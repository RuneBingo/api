import { Command } from '@nestjs/cqrs';

export class SignInWithEmailCommand extends Command<string> {
  constructor(public readonly email: string) {
    super();
  }
}
