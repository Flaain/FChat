import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { SigninRequest, SignupRequest } from './types';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { EMAIL_ALREADY_EXISTS, NAME_ALREADY_EXISTS } from './auth.constants';
import { ConfigService } from '@nestjs/config';
import { compare } from 'bcrypt';
import { IUser, UserDocument } from 'src/user/types';
import { INVALID_CREDENTIALS, SOMETHING_WENT_WRONG, UNAUTHORIZED } from 'src/utils/constants';
import { Types } from 'mongoose';

@Injectable()
export class AuthService  {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}
    
    private checkName = async (name: string) => {
        const candidate = await this.userService.findOneByPayload({ name: { $regex: name, $options: 'i' } });

        if (candidate) throw new HttpException(NAME_ALREADY_EXISTS, HttpStatus.BAD_REQUEST);

        return { status: HttpStatus.OK, message: 'OK' };
    };

    private createToken = (_id: string) => ({
        accessToken: this.jwtService.sign({ _id }),
        expiersIn: this.configService.get<string>('JWT_EXPIERSIN'),
    });

    signin = async ({ login, password }: SigninRequest): Promise<Omit<IUser, "password">> => {
        try {
            const candidate = await this.userService.findOneByPayload({ $or: [{ email: login }, { name: { $regex: login, $options: 'i' } }] });
    
            if (!candidate) throw new HttpException(INVALID_CREDENTIALS, HttpStatus.UNAUTHORIZED);

            const { password: candidatePassword, ...rest } = candidate.toObject();
            const isPasswordValid = await compare(password, candidatePassword);

            if (!isPasswordValid) throw new HttpException(INVALID_CREDENTIALS, HttpStatus.UNAUTHORIZED);

            const token = this.createToken(rest._id.toString());

            return { ...rest, ...token };
        } catch (error) {
            console.log(error);
            throw new HttpException(error.response, error.status);
        }
    }

    signup = async (dto: SignupRequest): Promise<Omit<IUser, 'password'>> => {
        try {
            await Promise.all([this.checkEmail(dto.email), this.checkName(dto.name)]);

            const { _id, ...user } = await this.userService.create(dto);

            return { ...user, ...this.createToken(_id.toString()), _id };
        } catch (error) {
            console.log(error);
            throw new HttpException(error.response, error.status);
        }
    };

    checkEmail = async (email: string) => {
        const candidate = await this.userService.findOneByPayload({ email });

        if (candidate) throw new HttpException(EMAIL_ALREADY_EXISTS, HttpStatus.BAD_REQUEST);

        return { status: HttpStatus.OK, message: 'OK' };
    };

    validateUser = async (id: Types.ObjectId | string) => {
        const candidate = await this.userService.findById(id);

        if (!candidate) throw new UnauthorizedException(UNAUTHORIZED);

        return candidate;
    };

    getProfile = async (user: UserDocument) => {
        const { password, ...rest } = user.toObject();
        return rest;
    };
}