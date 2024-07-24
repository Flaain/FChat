import { Types } from 'mongoose';
import { HttpStatus, Injectable } from '@nestjs/common';
import { IAuthService, WithUserAgent } from './types';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JWT_KEYS } from 'src/utils/types';
import { AppException } from 'src/utils/exceptions/app.exception';
import { BcryptService } from 'src/utils/services/bcrypt/bcrypt.service';
import { otpError } from './constants';
import { SigninDTO } from './dtos/auth.signin.dto';
import { SignupDTO } from './dtos/auth.signup.dto';
import { UserService } from '../user/user.service';
import { OtpService } from '../otp/otp.service';
import { SessionService } from '../session/session.service';
import { OtpType } from '../otp/types';
import { UserDocument } from '../user/types';
import { User } from '../user/schemas/user.schema';

@Injectable()
export class AuthService implements IAuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly otpService: OtpService,
        private readonly sessionService: SessionService,
        private readonly bcryptService: BcryptService,
    ) {}
    
    private signAuthTokens = ({ sessionId, userId }: { sessionId: string; userId: string }) => {
        const refreshToken = this.jwtService.sign({ sessionId }, { 
            secret: this.configService.get<string>(JWT_KEYS.REFRESH_TOKEN_SECRET),
            expiresIn: this.configService.get<string>(JWT_KEYS.REFRESH_TOKEN_EXPIRESIN),
        });

        const accessToken = this.jwtService.sign({ userId, sessionId });

        return { accessToken, refreshToken };
    }

    signin = async ({ login, password, userAgent }: WithUserAgent<SigninDTO>) => {
        const user = await this.userService.findOneByPayload({ isDeleted: false, $or: [{ email: login }, { login }] });

        if (!user) throw new AppException({ message: 'Invalid credentials' }, HttpStatus.UNAUTHORIZED);

        const { password: hashedPassword, ...rest } = user.toObject();

        if (!await this.bcryptService.compareAsync(password, hashedPassword)) {
            throw new AppException({ message: 'Invalid credentials' }, HttpStatus.UNAUTHORIZED);
        }

        const session = await this.sessionService.create({ userId: user._id, userAgent });

        return { user: rest, ...this.signAuthTokens({ sessionId: session._id.toString(), userId: user._id.toString() }) };
    }

    signup = async ({ password, otp, userAgent, ...dto }: WithUserAgent<SignupDTO>) => {     
        if (await this.userService.findOneByPayload({$or: [{ email: dto.email }, { login: dto.login }] })) {
            throw new AppException({ 
                message: 'An error occurred during the registration process. Please try again.'
            }, HttpStatus.BAD_REQUEST);
        }

        if (!await this.otpService.findOneAndDelete({ otp, email: dto.email, type: OtpType.EMAIL_VERIFICATION })) {
            throw new AppException(otpError, HttpStatus.BAD_REQUEST);
        }

        const hashedPassword = await this.bcryptService.hashAsync(password);
        const user = await this.userService.create({ ...dto, password: hashedPassword });
        const session = await this.sessionService.create({ userId: user._id, userAgent });

        return { user, ...this.signAuthTokens({ sessionId: session._id.toString(), userId: user._id.toString() }) };
    };

    validate = async (id: Types.ObjectId | string) => {
        const candidate = await this.userService.findOneByPayload({ _id: id, isDeleted: false });

        if (!candidate) throw new AppException({ message: "Unauthorized" }, HttpStatus.UNAUTHORIZED);

        return candidate;
    };

    profile = async (user: UserDocument) => {
        const { password, ...rest } = user.toObject<User>();
        
        return rest;
    };
}