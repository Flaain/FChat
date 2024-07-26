import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { Request } from 'express';
import { AuthCookiesName, JWT_KEYS } from 'src/utils/types';

@Injectable()
export class AuthAccessStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService,
    ) {
        super({
            jwtFromRequest: AuthAccessStrategy.extractJWT,
            secretOrKey: configService.get<string>(JWT_KEYS.ACCESS_TOKEN_SECRET),
            ignoreExpiration: false,
        });
    }

    private static extractJWT = (req: Request) => (AuthCookiesName.ACCESS_TOKEN in req.cookies) ? req.cookies[AuthCookiesName.ACCESS_TOKEN] : null;

    validate = async ({ userId, sessionId }: { userId: string; sessionId: string }) => {
        const user = await this.authService.validate(userId);
        
        return { doc: user, sessionId };
    };
}