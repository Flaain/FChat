import { Types } from 'mongoose';
import { HttpStatus, Injectable } from '@nestjs/common';
import { SigninRequest, SignupRequest } from './types';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AppExceptionCode, JWT_KEYS } from 'src/utils/types';
import { AppException } from 'src/utils/exceptions/app.exception';
import { AuthUtils } from './auth.utils';
import { UserService } from '../user/user.service';
import { OtpService } from '../otp/otp.service';
import { SessionService } from '../session/session.service';
import { BcryptService } from 'src/utils/services/bcrypt/bcrypt.service';
import { OtpType } from '../otp/types';
import { UserDocument } from '../user/types';
import { User } from '../user/schemas/user.schema';

@Injectable()
export class AuthService  {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly otpService: OtpService,
        private readonly sessionService: SessionService,
        private readonly bcryptService: BcryptService,
        private readonly authUtils: AuthUtils,
    ) {}

    signin = async ({ login, password, userAgent }: SigninRequest) => {
        const user = await this.userService.findOneByPayload({ 
            deleted: false, 
            $or: [{ email: login }, { name: { $regex: login, $options: 'i' } }] 
        });

        if (!user) throw new AppException({ message: 'Invalid credentials' }, HttpStatus.UNAUTHORIZED);

        const { password: userPassword, ...rest } = user.toObject();

        if (!await this.bcryptService.compareAsync(password, userPassword)) {
            throw new AppException({ message: 'Invalid credentials' }, HttpStatus.UNAUTHORIZED);
        }

        const session = await this.sessionService.create({ userId: user._id, userAgent });
    }

    signup = async ({ password, otp, ...dto }: SignupRequest) => {        
        if (!await this.otpService.findOneAndDelete({ otp, email: dto.email, type: OtpType.EMAIL_VERIFICATION })) {
            throw new AppException({ 
                message: "Invalid OTP code", 
                errors: [{ message: 'Invalid OTP code', path: 'otp' }], 
                errorCode: AppExceptionCode.FORM 
            }, HttpStatus.BAD_REQUEST);
        }

        await Promise.all([this.authUtils.checkEmail(dto.email), this.authUtils.checkName(dto.name)]);

        const hashedPassword = await this.bcryptService.hashAsync(password);
        
        const { _id, deleted, ...user } = await this.userService.create({ ...dto, password: hashedPassword });
        const session = await this.sessionService.create({ userId: _id, userAgent: dto.userAgent });

        const refreshToken = this.jwtService.sign({ sessionId: session._id.toString() }, { 
            secret: this.configService.get<string>(JWT_KEYS.REFRESH_TOKEN_SECRET),
            expiresIn: this.configService.get<string>(JWT_KEYS.REFRESH_TOKEN_EXPIRESIN),
        });

        const accessToken = this.jwtService.sign({ userId: _id.toString(), sessionId: session._id.toString() });

        return { user, accessToken, refreshToken };
    };

    validate = async (id: Types.ObjectId | string) => {
        const candidate = await this.userService.findOneByPayload({ _id: id, deleted: false });

        if (!candidate) throw new AppException({ message: "Unauthorized" }, HttpStatus.UNAUTHORIZED);

        return candidate;
    };

    profile = async (user: UserDocument) => {
        const { password, ...rest } = user.toObject<User>();
        
        return rest;
    };
}