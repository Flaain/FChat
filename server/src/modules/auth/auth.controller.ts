import { Request, Response } from 'express';
import { SigninDTO } from './dtos/auth.signin.dto';
import { SignupDTO } from './dtos/auth.signup.dto';
import { AuthService } from './auth.service';
import { SkipThrottle } from '@nestjs/throttler';
import { CheckEmailDTO } from './dtos/auth.check.email.dto';
import { RequestWithUser, Routes } from 'src/utils/types';
import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthUtils } from './auth.utils';
import { CheckNameDTO } from './dtos/auth.check.name.dto';
import { CookiesService } from 'src/utils/services/cookies/cookies.service';
import { JwtGuard } from 'src/utils/guards/jwt.guard';

@Controller(Routes.AUTH)
export class AuthController {
    constructor(
        private readonly authUtils: AuthUtils,
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

    @Post('signup/check-email')
    checkEmail(@Body() { email }: CheckEmailDTO) {
        return this.authUtils.checkEmail(email);
    }

    @Post('signup/check-name')
    checkName(@Body() { name }: CheckNameDTO) {
        return this.authUtils.checkName(name);
    }

    @Post('signin')
    signin(@Body() dto: SigninDTO) {
        return this.authService.signin(dto);
    }

    @Get('me')
    @SkipThrottle()
    @UseGuards(JwtGuard)
    profile(@Req() req: RequestWithUser) {
        return this.authService.profile(req.user);
    }
}
