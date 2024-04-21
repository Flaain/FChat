import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthResponse, SigninRequest, SignupRequest } from './types';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { EMAIL_ALREADY_EXISTS, INVALID_CREDENTIALS, NAME_ALREADY_EXISTS, SOMETHING_WENT_WRONG } from './auth.constants';
import { ConfigService } from '@nestjs/config';
import { compare } from 'bcrypt';
import { UserDocumentType } from 'src/user/types';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) {}

    async signin({ email, password }: SigninRequest) {
        const candidate = await this.userService.findByPayload({ email });
        
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

    _checkEmail = async (payload: Pick<SignupRequest, 'email'>) => {
        const candidate = await this.userService.findByPayload(payload);

        if (candidate) throw new HttpException(EMAIL_ALREADY_EXISTS, HttpStatus.BAD_REQUEST);

        return { status: HttpStatus.OK, message: 'OK' };
    };

    private _checkName = async (payload: Pick<SignupRequest, 'name'>) => {
        const candidate = await this.userService.findByPayload(payload);

        if (candidate) throw new HttpException(NAME_ALREADY_EXISTS, HttpStatus.BAD_REQUEST);

        return { status: HttpStatus.OK, message: 'OK' };
    }

    private _createToken = (_id: string) => ({ accessToken: this.jwtService.sign({ _id }), expiersIn: this.configService.get<string>('JWT_EXPIERSIN') });

    private _validateUserBeforeSignup = async (dto: SignupRequest) => {
        await Promise.all([this._checkEmail({ email: dto.email }), this._checkName({ name: dto.name })]);
    };

    signup = async (dto: SignupRequest): Promise<AuthResponse> => {
        await this._validateUserBeforeSignup(dto);
        
        try {
            const { _id, ...user } = await this.userService.create(dto);
            const token = this._createToken(_id.toString());

            return { ...user, ...token, conversations: [], id: _id.toString() };
        } catch (error) {
            console.log(error);
            throw new HttpException(SOMETHING_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    };

    getProfile = async (user: UserDocumentType) => this.userService.profile(user);
}
