import {
    Body,
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Post,
} from '@nestjs/common';
import { MeDTO } from './dto/auth.me.dto';
import { AuthService } from './auth.service';
import { SigninDTO } from './dto/auth.signin.dto';
import { SigninResponse } from './types';
import { SignupDTO } from './dto/auth.signup.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('signup')
    async signup(@Body() dto: SignupDTO) {
        return this.authService.signup(dto);
    }

    @Post('signup/check-email')
    async checkEmail(@Body() dto: SignupDTO) {
        return this.authService.checkEmail(dto);
    }
    
    @Post('signin')
    async signin(@Body() dto: SigninDTO): Promise<SigninResponse> {
        return this.authService.signin(dto);
    }

    @Get('me')
    async me(@Body() dto: MeDTO) {
        return {
            id: 'window.crypto.randomUUID()',
            username: 'User',
            email: 'g7yJt@example.com',
            conversations: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            token: 123,
        };
    }
}