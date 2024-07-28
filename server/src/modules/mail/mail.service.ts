import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) {}

    sendTestEmail = async () => {
        try {
            await this.mailerService.sendMail({
                to: 'xxx',
                from: {
                    name: 'FCHAT-OTP',
                    address: 'xxx',
                },
                subject: 'Test email',
                text: 'OTP CODE VERIFICATION',
                html: '<b>Here is your OTP - 123321</b>',
            });
    
            return {
                message: 'Email sent successfully',
            };
        } catch (error) {
            console.log(error)
            return {
                message: 'Email not sent',
            }
        }
    };
}