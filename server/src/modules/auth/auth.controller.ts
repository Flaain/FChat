import { Request, Response } from 'express';
import { SigninDTO } from './dtos/auth.signin.dto';
import { SignupDTO } from './dtos/auth.signup.dto';
import { AuthService } from './auth.service';
import { RequestWithSession, RequestWithUser, Routes } from 'src/utils/types';
import { Body, Controller, Get, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { CookiesService } from 'src/utils/services/cookies/cookies.service';
import { IAuthController } from './types';
import { AccessGuard } from 'src/utils/guards/access.guard';
import { RefreshGuard } from 'src/utils/guards/refresh.guard';

@Controller(Routes.AUTH)
export class AuthController implements IAuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly cookiesService: CookiesService,
    ) {}

    @Post('signup')
    async signup(@Body() dto: SignupDTO, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const { user, accessToken, refreshToken } = await this.authService.signup({
            ...dto,
            userAgent: req.headers['user-agent'],
        });

        this.cookiesService.setAuthCookies({ res, accessToken, refreshToken });

        return user;
    }

    @Post('signin')
    async signin(@Body() dto: SigninDTO, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const { user, accessToken, refreshToken } = await this.authService.signin({
            ...dto,
            userAgent: req.headers['user-agent'],
        });

        this.cookiesService.setAuthCookies({ res, accessToken, refreshToken });

        return user;
    }

    @Get('refresh')
    @UseGuards(RefreshGuard)
    async refresh(@Req() req: RequestWithSession, @Res({ passthrough: true }) res: Response) {
       const { accessToken } = await this.authService.refresh(req.user.session);

       this.cookiesService.setAccessToken(res, accessToken);

       return { message: 'refresh success', statusCode: HttpStatus.OK };
    }

    @Get('logout')
    @UseGuards(AccessGuard)
    async logout(@Req() req: RequestWithUser, @Res({ passthrough: true }) res: Response) {
        const status = await this.authService.logout({ user: req.user.doc, sessionId: req.user.sessionId });

        this.cookiesService.removeAuthCookies(res);

        return status;
    }

    @Get('me')
    @UseGuards(AccessGuard)
    profile(@Req() req: RequestWithUser) {
        return this.authService.profile(req.user.doc);
    }
}