import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SigninRequest, SigninResponse, SignupRequest } from './types';

@Injectable()
export class AuthService {
    async signin({ email, password }: SigninRequest): Promise<SigninResponse> {
        try {
            const res = await new Promise<SigninResponse>((resolve, reject) => {
                setTimeout(() => {
                    resolve({
                        accessToken: '123',
                        birthDate: new Date(),
                        conversations: [],
                        createdAt: new Date(),
                        email: 'g7yJt@example.com',
                        id: '123',
                        name: 'User',
                        updatedAt: new Date(),
                    });
                }, 2000);
            });

            return res;
        } catch (error) {}
    }

    async checkEmail({ email }: Pick<SignupRequest, 'email'>) {
        try {
            const res = await new Promise<SigninResponse>((resolve, reject) => {
                resolve({
                    accessToken: '123',
                    birthDate: new Date(),
                    conversations: [],
                    createdAt: new Date(),
                    email: 'g7yJt@example.com',
                    id: '123',
                    name: 'User',
                    updatedAt: new Date(),
                });
            });

            return res;
        } catch (error) {
            console.log(error);
            throw new HttpException({ 
                status: HttpStatus.BAD_REQUEST,
                message: "please try to signup with another email",
                error
            }, HttpStatus.BAD_REQUEST);
        }
    }

    async signup({ email, name, password, birthDate }: SignupRequest) {
        try {
            const res = await new Promise<SigninResponse>((resolve, reject) => {
                reject({ email: { message: 'this email already exists with signup' } });
            });
        } catch (error) {
            console.log(error);
            throw new HttpException({ status: HttpStatus.BAD_REQUEST, error }, HttpStatus.BAD_REQUEST);
        }
    }

    me() {}
}
