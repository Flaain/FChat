import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDTO } from './dtos/auth.signin.dto';
import { SignupDTO } from './dtos/auth.signup.dto';
import { JwtAuthGuard } from './guards/jwt.guard';
import { AuthResponse } from './types';
import { Routes } from 'src/utils/types';
import { UserDocumentType } from 'src/user/types';
import { SkipThrottle } from '@nestjs/throttler';

@Controller(Routes.AUTH)
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post(Routes.SIGNUP)
    signup(@Body() dto: SignupDTO): Promise<AuthResponse> {
        return this.authService.signup(dto);
    }

    @Post(Routes.CHECK_EMAIL)
    checkEmail(@Body() dto: Pick<SigninDTO, 'email'>) {
        return this.authService._checkEmail(dto);
    }

    @Post(Routes.SIGNIN)
    signin(@Body() dto: SigninDTO) {
        return this.authService.signin(dto);
    }

    @UseGuards(JwtAuthGuard)
    @Get(Routes.ME)
    @SkipThrottle()
    profile(@Req() req: Request & { user: UserDocumentType }) {
        return this.authService.getProfile(req.user);
    }
}