import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { Request } from 'express';
import { JWT_KEYS } from 'src/utils/types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService,
    ) {
        super({
            jwtFromRequest: JwtStrategy.extractJWT,
            secretOrKey: configService.get<string>(JWT_KEYS.ACCESS_TOKEN_SECRET),
            ignoreExpiration: false,
        });
    }

    private static extractJWT = (req: Request) => {
        if (req && req.cookies && 'accessToken' in req.cookies) {
            return req.cookies.accessToken;
        }
        return null;
    }

    validate = async ({ userId }: { userId: string; sessionId: string }) => this.authService.validate(userId);
}