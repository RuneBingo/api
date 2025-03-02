export abstract class EmailTemplate {
  constructor(
    protected recipient: string,
    protected template: string,
  ) {}

  abstract getSubject(): string;
  abstract getContext(): object;

  getRecipient(): string {
    return this.recipient;
  }

  getTemplate(): string {
    return this.template;
  }

  getFrom(): string {
    return process.env.EMAIL_FROM || 'No Reply <default-email@gmail.com>';
  }
}
