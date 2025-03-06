import type { I18nPath } from '@/i18n/types';

import { EmailTemplate } from './email-template';

export class VerificationEmail extends EmailTemplate<{ code: string }> {
  public template = 'verification-email';
  public subject: I18nPath = 'email.verificationEmail.subject';
}
