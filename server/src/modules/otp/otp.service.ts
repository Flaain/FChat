import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { OTP } from './schemas/otp.schema';
import { AppException } from 'src/utils/exceptions/app.exception';
import { IOtpService, OtpType } from './types';
import { UserService } from '../user/user.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class OtpService implements IOtpService {
    constructor(
        @InjectModel(OTP.name) private readonly otpModel: Model<OTP>,
        private readonly userService: UserService,
        private readonly mailService: MailService
    ) {}

    create = async ({ email, type }: Pick<OTP, 'email' | 'type'>) => {
        const isUserAlreadyExists = await this.userService.exists({ email });

        if (isUserAlreadyExists && type === OtpType.EMAIL_VERIFICATION) {
            throw new AppException({ message: 'Cannot create OTP code' }, HttpStatus.CONFLICT);
        }

        const otpExists = await this.otpModel.findOne({ email, type }, { expiresAt: 1 });

        if (otpExists && new Date(otpExists.expiresAt).getTime() > Date.now()) {
            return { retryDelay: new Date(otpExists.expiresAt).getTime() - Date.now() };
        }

        const generatedOTP = Math.floor(100000 + Math.random() * 900000);

        const otp = await this.otpModel.create({ email, otp: generatedOTP, type });

        try {
            await this.mailService.sendOtpEmail(generatedOTP, { 
                from: {
                    name: 'FCHAT',
                    address: process.env.MAILER_USER
                },
                to: email, 
                subject: 'Verification code',
             });
        } catch (error) {
            console.log(error);
            throw new AppException({ message: "Failed to send verification code" }, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return { retryDelay: new Date(otp.expiresAt).getTime() - Date.now() };
    };

    exists = (query: FilterQuery<OTP>) => this.otpModel.exists(query);

    findOneAndDelete = (query: FilterQuery<OTP>) => this.otpModel.findOneAndDelete(query);
}