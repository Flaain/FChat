import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { getOtpTemplate } from './templates';

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) {}

    sendOtpEmail = (otp: number, options?: Omit<ISendMailOptions, 'html' | 'template'>) => {
        return this.mailerService.sendMail({ ...options, html: getOtpTemplate(otp) });
    };
}