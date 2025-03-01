import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class SignInWithEmailDto {
  @IsEmail()
  @ApiProperty()
  email: string;
}
