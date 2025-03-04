import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';

import { EmailTemplate } from './templates/email-template';

@Injectable()
export class EmailerService {
  private readonly logger = new Logger(EmailerService.name);

  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendEmail(emailTemplate: EmailTemplate) {
    const { to, subject, template, context } = emailTemplate;
    try {
      await this.mailerService.sendMail({
        to,
        subject,
        template,
        context,
      });

      if (this.configService.get('NODE_ENV') === 'development') {
        this.logger.log(`Sent ${subject} email to ${to}`);
      }
    } catch (error) {
      this.logger.log('Error sending email: ', error);
    }
  }
}
