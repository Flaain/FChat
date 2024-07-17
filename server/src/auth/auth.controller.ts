import { Request, Response } from 'express';
import { JwtGuard } from '../utils/guards/jwt.guard';
import { SigninDTO } from './dtos/auth.signin.dto';
import { SignupDTO } from './dtos/auth.signup.dto';
import { AuthService } from './auth.service';
import { SkipThrottle } from '@nestjs/throttler';
import { CheckEmailDTO } from './dtos/auth.checkEmail.dto';
import { RequestWithUser, Routes } from 'src/utils/types';
import { Body, Controller, Get, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { setAuthCookies } from './utils/cookies';

@Controller(Routes.AUTH)
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('signup')
    async signup(@Body() dto: SignupDTO, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const { user, accessToken, refreshToken } = await this.authService.signup({ ...dto, userAgent: req.headers['user-agent'] });

        setAuthCookies({ res, accessToken, refreshToken });

        return user;
    }

    @Post('signup/check-email')
    checkEmail(@Body() { email }: CheckEmailDTO) {
        return this.authService.checkEmail(email);
    }

    @Post('signin')
    signin(@Body() dto: SigninDTO) {
        return this.authService.signin(dto);
    }

    @Get('me')
    @SkipThrottle()
    @UseGuards(JwtGuard)
    profile(@Req() req: RequestWithUser) {
        return this.authService.getProfile(req.user);
    }
}