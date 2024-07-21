import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { OTP } from './schemas/otp.schema';
import { UserService } from 'src/user/user.service';
import { AppException } from 'src/utils/exceptions/app.exception';
import { cannotCreateOtpError } from './constants';
import { OtpType } from './types';

@Injectable()
export class OtpService {
    constructor(
        @InjectModel(OTP.name) private readonly otpModel: Model<OTP>,
        private readonly userService: UserService,
    ) {}

    create = async ({ email, type }: Pick<OTP, 'email' | 'type'>) => {
        const now = new Date().getTime();

        const isUserAlreadyExists = await this.userService.exists({ email });

        if (isUserAlreadyExists && type === OtpType.EMAIL_VERIFICATION) throw new AppException(cannotCreateOtpError, HttpStatus.CONFLICT);

        const otpExists = await this.otpModel.findOne({ email, type }, { expiresAt: 1 });

        if (otpExists && new Date(otpExists.expiresAt).getTime() > now) return { retryDelay: new Date(otpExists.expiresAt).getTime() - now };

        const generatedOTP = Math.floor(100000 + Math.random() * 900000);

        const otp = await this.otpModel.create({ email, otp: generatedOTP, type });

        return { retryDelay: new Date(otp.expiresAt).getTime() - now };
    };

    exists = (query: FilterQuery<OTP>) => this.otpModel.exists(query);

    findOneAndDelete = (query: FilterQuery<OTP>) => this.otpModel.findOneAndDelete(query);
}