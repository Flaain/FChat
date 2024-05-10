import { HttpException, HttpStatus, Injectable, Type, UnauthorizedException } from '@nestjs/common';
import { IAuthService, SigninRequest, SignupRequest } from './types';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { EMAIL_ALREADY_EXISTS, NAME_ALREADY_EXISTS } from './auth.constants';
import { ConfigService } from '@nestjs/config';
import { compare } from 'bcrypt';
import { IUser, UserDocumentType } from 'src/user/types';
import { INVALID_CREDENTIALS, SOMETHING_WENT_WRONG, UNAUTHORIZED } from 'src/utils/constants';
import { Types } from 'mongoose';
import { ConversationService } from 'src/conversation/conversation.service';

@Injectable()
export class AuthService implements IAuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    signin = async ({ login, password }: SigninRequest): Promise<Omit<IUser, "password">> => {
        const candidate = await this.userService.findOneByPayload({ $or: [{ email: login }, { name: { $regex: login, $options: 'i' } }] });

        if (!candidate) throw new HttpException(INVALID_CREDENTIALS, HttpStatus.UNAUTHORIZED);

        try {
            const { password: candidatePassword, ...rest } = candidate.toObject();
            const isPasswordValid = await compare(password, candidatePassword);

            if (!isPasswordValid) throw new HttpException(INVALID_CREDENTIALS, HttpStatus.UNAUTHORIZED);

            const token = this._createToken(rest._id.toString());

            const conversations = await this.userService.getConversations(rest._id);
            
            return { ...rest, ...token, conversations };
        } catch (error) {
            console.log(error);
            throw new HttpException(error.message, error.status);
        }
    }

    signup = async (dto: SignupRequest): Promise<Omit<IUser, 'password'>> => {
        await this._validateUserBeforeSignup({ email: dto.email, name: dto.name });

        try {
            const { _id, ...user } = await this.userService.create(dto);
            const token = this._createToken(_id.toString());

            return { ...user, ...token, conversations: [], _id };
        } catch (error) {
            console.log(error);
            throw new HttpException(SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    };

    _checkEmail = async (email: string) => {
        const candidate = await this.userService.findOneByPayload({ email });

        if (candidate) throw new HttpException(EMAIL_ALREADY_EXISTS, HttpStatus.BAD_REQUEST);

        return { status: HttpStatus.OK, message: 'OK' };
    };

    _checkName = async (name: string) => {
        const candidate = await this.userService.findOneByPayload({ name: { $regex: name, $options: 'i' } });

        if (candidate) throw new HttpException(NAME_ALREADY_EXISTS, HttpStatus.BAD_REQUEST);

        return { status: HttpStatus.OK, message: 'OK' };
    };

    _createToken = (_id: string) => ({
        accessToken: this.jwtService.sign({ _id }),
        expiersIn: this.configService.get<string>('JWT_EXPIERSIN'),
    });

    _validateUserBeforeSignup = async ({ email, name }: Pick<SignupRequest, "email" | "name">) => {
        await Promise.all([this._checkEmail(email), this._checkName(name)]);
    };

    validateUser = async (id: Types.ObjectId | string) => {
        const candidate = await this.userService.findById(id);

        if (!candidate) throw new UnauthorizedException(UNAUTHORIZED);

        return candidate;
    };

    getProfile = async (user: UserDocumentType) => this.userService.profile(user);
}