import { ICommand } from '@nestjs/cqrs';

export class SignInWithEmailCommand implements ICommand {
  constructor(public readonly email: string) {}
}
