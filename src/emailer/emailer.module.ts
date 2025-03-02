import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailerService } from './emailer.service';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import Handlebars from 'handlebars';
import * as path from 'path'

@Module({
    imports: [
        ConfigModule.forRoot(),
        MailerModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                transport: {
                    service: "gmail",
                    auth: {
                        user: configService.get<string>('EMAIL_USER'),
                        pass: configService.get<string>('EMAIL_PASS'),
                    },
                },
                defaults: {
                    from: configService.get<string>('EMAIL_FROM'),
                },
                template: {
                    dir: path.join(__dirname, '/templates/html'),
                    adapter: new HandlebarsAdapter(),
                    options: {
                        strict: true
                    },
                },
            })
        })
    ],
    providers: [EmailerService],
    exports: [EmailerService]
})
export class EmailerModule {}
