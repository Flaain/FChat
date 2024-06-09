import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDTO } from './dtos/auth.signin.dto';
import { SignupDTO } from './dtos/auth.signup.dto';
import { JwtGuard } from '../utils/jwt.guard';
import { RequestWithUser, Routes } from 'src/utils/types';
import { SkipThrottle } from '@nestjs/throttler';
import { CheckEmailDTO } from './dtos/auth.checkEmail.dto';

@Controller(Routes.AUTH)
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('signup')
    signup(@Body() dto: SignupDTO) {
        return this.authService.signup(dto);
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