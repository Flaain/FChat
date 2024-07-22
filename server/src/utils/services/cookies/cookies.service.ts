import { Injectable } from '@nestjs/common';
import { CookieOptions, Response } from 'express';
import { DatesService } from '../dates/dates.service';

@Injectable()
export class CookiesService {
    private readonly cookieDefault: CookieOptions = {
        sameSite: 'strict',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
    };

    setAccessToken(res: Response, accessToken: string) {
        res.cookie('accessToken', accessToken, {
            ...this.cookieDefault,
            expires: DatesService.fifteenMinutesFromNow(),
        });

        return this;
    }

    setRefreshToken(res: Response, refreshToken: string) {
        res.cookie('refreshToken', refreshToken, {
            ...this.cookieDefault,
            expires: DatesService.oneMonthFromNow(),
            path: '/auth/refresh',
        });

        return this;
    }

    setAuthCookies({ res, accessToken, refreshToken }: { res: Response; accessToken: string; refreshToken: string }) {
        this.setAccessToken(res, accessToken).setRefreshToken(res, refreshToken);
    }
}