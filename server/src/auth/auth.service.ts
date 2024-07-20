import { Types } from 'mongoose';
import { HttpStatus, Injectable } from '@nestjs/common';
import { SigninRequest, SignupRequest } from './types';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserDocument } from 'src/user/types';
import { BcryptService } from 'src/utils/bcrypt/bcrypt.service';
import { SessionService } from 'src/session/session.service';
import { JWT_KEYS } from 'src/utils/types';
import { AppException } from 'src/utils/exceptions/app.exception';
import { OTPService } from 'src/otp/otp.service';

@Injectable()
export class AuthService  {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly otpService: OTPService,
        private readonly sessionService: SessionService,
        private readonly bcryptService: BcryptService,
    ) {}
    
    private checkName = async (name: string) => {
        const candidate = await this.userService.exists({ name: { $regex: name, $options: 'i' } });

        if (candidate) throw new AppException('User with this name already exists', HttpStatus.CONFLICT);

        return { status: HttpStatus.OK, message: 'OK' };
    };

    signin = async ({ login, password, userAgent }: SigninRequest) => {
        const user = await this.userService.findOneByPayload({ 
            deleted: false, 
            $or: [{ email: login }, { name: { $regex: login, $options: 'i' } }] 
        });

        if (!user) throw new AppException('Invalid credentials', HttpStatus.UNAUTHORIZED);

        const { password: userPassword, ...rest } = user.toObject();

        if (!await this.bcryptService.compareAsync(password, userPassword)) throw new AppException('Invalid credentials', HttpStatus.UNAUTHORIZED);

        const session = await this.sessionService.create({ userId: user._id, userAgent });
    }

    signup = async ({ password, ...dto }: SignupRequest) => {
        await Promise.all([this.checkEmail(dto.email), this.checkName(dto.name)]);

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

    checkEmail = async (email: string) => {
        const candidate = await this.userService.exists({ email });

        if (candidate) throw new AppException('User with this email already exists', HttpStatus.CONFLICT);

        return { status: HttpStatus.OK, message: 'OK' };
    };

    validateUser = async (id: Types.ObjectId | string) => {
        const candidate = await this.userService.findOneByPayload({ _id: id, deleted: false });

        if (!candidate) throw new AppException('unauthorized', HttpStatus.UNAUTHORIZED);

        return candidate;
    };

    getProfile = async (user: UserDocument) => {
        const { password, ...rest } = user.toObject();
        return rest;
    };
}