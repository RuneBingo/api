import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { EmailTemplate } from './templates/email-template';

@Injectable()
export class EmailerService {
    constructor(private readonly mailerService: MailerService) {}

    async sendEmail(emailTemplate: EmailTemplate) {
        try {
            await this.mailerService.sendMail({
                to: emailTemplate.getRecipient(),
                from: emailTemplate.getFrom(),
                subject: emailTemplate.getSubject(),
                template: emailTemplate.getTemplate(),
                context: emailTemplate.getContext(),
            });
        } catch (error) {
            console.error('Error sending email: ', error);
        }
    }
}
