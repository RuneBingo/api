import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import { I18nService } from 'nestjs-i18n';

import type { I18nTranslations } from '@/i18n/types';

import { EmailTemplate } from './templates/email-template';

@Injectable()
export class EmailerService {
  private readonly logger = new Logger(EmailerService.name);

  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
    private readonly i18nService: I18nService<I18nTranslations>,
  ) {}

  async sendEmail(emailTemplate: EmailTemplate) {
    const { to, lang, subject: subjectKey, template, context } = emailTemplate;

    context['i18nLang'] = emailTemplate.lang;

    const subject: string = this.i18nService.translate(subjectKey, { lang });

    try {
      await this.mailerService.sendMail({
        to,
        subject,
        template,
        context,
      });

      if (this.configService.get('NODE_ENV') === 'development') {
        this.logger.log(`Sent ${subject} email to ${to} in ${lang}.`);
      }
    } catch (error) {
      this.logger.log('Error sending email: ', error);
    }
  }
}
