import { IsEmail } from 'class-validator';

export class SignInWithEmailDto {
  @IsEmail()
  email: string;
}
