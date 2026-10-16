import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer, { Transporter } from 'nodemailer';

@Injectable()
export class MailService {
    private _transporter: Transporter;

    constructor(private _configService: ConfigService) {
        this._transporter =  nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: _configService.getOrThrow('SMTP_EMAIL'),
                pass: _configService.getOrThrow('SMTP_PASSWORD')
            }
        });
    }

    async sendMessage(to: string, subject: string, text: string, eventType: string) {
        await this._transporter.sendMail({
            from: 'Tracking system',
            to,
            subject,            
            html: text
        })
    }
}
