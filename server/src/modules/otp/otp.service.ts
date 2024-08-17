import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { OTP } from './schemas/otp.schema';
import { AppException } from 'src/utils/exceptions/app.exception';
import { IOtpService, OtpType } from './types';
import { UserService } from '../user/user.service';
import { MailService } from '../mail/mail.service';
import { OtpVerifyDTO } from './dtos/otp.verify.dto';

@Injectable()
export class OtpService implements IOtpService {
    constructor(
        @InjectModel(OTP.name) private readonly otpModel: Model<OTP>,
        private readonly userService: UserService,
        private readonly mailService: MailService
    ) {}

    create = async ({ email, type }: Pick<OTP, 'email' | 'type'>) => {
        if (type === OtpType.EMAIL_VERIFICATION && await this.userService.exists({ email })) {
            throw new AppException({ message: 'Cannot create OTP code' }, HttpStatus.CONFLICT);
        }

        const otpExists = await this.otpModel.findOne({ email, type }, { expiresAt: 1 });

        if (otpExists && new Date(otpExists.expiresAt).getTime() > Date.now()) {
            return { retryDelay: new Date(otpExists.expiresAt).getTime() - Date.now() };
        }

        const generatedOTP = Math.floor(100000 + Math.random() * 900000);

        const otp = await this.otpModel.create({ email, otp: generatedOTP, type });

        await this.mailService.sendOtpEmail({ otp: generatedOTP, type, email });

        return { retryDelay: new Date(otp.expiresAt).getTime() - Date.now() };
    };

    verify = async ({ otp, email, type }: OtpVerifyDTO) => {
        if (!await this.exists({ otp, email, type })) {
            throw new AppException({
                message: 'Invalid OTP code',
                errors: [{ path: 'otp', message: 'Invalid OTP code' }]
            }, HttpStatus.BAD_REQUEST);
        }

        return { message: 'OK', statusCode: HttpStatus.OK }
    };

    exists = (query: FilterQuery<OTP>) => this.otpModel.exists(query);

    findOneAndDelete = (query: FilterQuery<OTP>) => this.otpModel.findOneAndDelete(query);
}