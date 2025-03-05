import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

import type { I18nTranslations } from '@/i18n/types';

export class SignInWithEmailDto {
  @IsEmail({}, { message: i18nValidationMessage<I18nTranslations>('validation.invalidEmail') })
  @ApiProperty()
  email: string;
}
