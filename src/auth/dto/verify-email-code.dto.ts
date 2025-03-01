import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class VerifyEmailCodeDto {
  @IsEmail()
  @ApiProperty()
  email: string;

  @ApiProperty()
  code: string;
}
