import { EmailTemplate } from "./email-template";

export class VerificationEmail extends EmailTemplate {
    constructor (
        protected recipient: string,
        private verificationCode: string
    ) {
        super(recipient, 'verification-email');
    }

    getSubject(): string {
        return 'Your RuneBingo verification code';
    }

    getContext(): object {
        return { code: this.verificationCode }
    }
}