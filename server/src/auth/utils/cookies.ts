import { CookieOptions, Response } from 'express';
import { DatesService } from 'src/utils/dates/dates.service';

const cookieDefault: CookieOptions = {
    sameSite: 'strict',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
};

export const setAuthCookies = ({
    res,
    accessToken,
    refreshToken,
}: {
    res: Response;
    accessToken: string;
    refreshToken: string;
}) =>
    res
        .cookie('accessToken', accessToken, {
            ...cookieDefault,
            expires: DatesService.fifteenMinutesFromNow(),
        })
        .cookie('refreshToken', refreshToken, {
            ...cookieDefault,
            expires: DatesService.oneMonthFromNow(),
            path: '/auth/refresh',
        });