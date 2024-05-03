import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDTO } from './dtos/auth.signin.dto';
import { SignupDTO } from './dtos/auth.signup.dto';
import { JwtGuard } from '../utils/jwt.guard';
import { AuthResponse } from './types';
import { Routes } from 'src/utils/types';
import { UserDocumentType } from 'src/user/types';
import { SkipThrottle } from '@nestjs/throttler';
import { CheckEmailDTO } from './dtos/auth.checkEmail.dto';

@Controller(Routes.AUTH)
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post("signup")
    signup(@Body() dto: SignupDTO): Promise<AuthResponse> {
        return this.authService.signup(dto);
    }

    @Post("signup/check-email")
    checkEmail(@Body() dto: CheckEmailDTO) {
        return this.authService._checkEmail(dto);
    }

    @Post("signin")
    signin(@Body() dto: SigninDTO) {
        return this.authService.signin(dto);
    }

    // @UseGuards(JwtGuard)
    // @Post("signout")
    // signout(@Req() req: Request & { user: UserDocumentType }) {
    //     return this.authService.signout(req.user);
    // }

    // @UseGuards(JwtGuard)
    // @Post("refresh")
    // refreshToken() {
    //     return 'refresh';
    // }

    @UseGuards(JwtGuard)
    @Get("me")
    @SkipThrottle()
    profile(@Req() req: Request & { user: UserDocumentType }) {
        return this.authService.getProfile(req.user);
    }
}