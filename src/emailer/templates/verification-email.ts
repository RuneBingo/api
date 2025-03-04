import { EmailTemplate } from './email-template';

export class VerificationEmail extends EmailTemplate<{ code: string }> {
  public template = 'verification-email';
  public subject = 'Your Runebingo verification email';
}
