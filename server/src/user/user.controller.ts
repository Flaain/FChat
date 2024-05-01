import { Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { Routes } from 'src/utils/types';
import { JwtGuard } from 'src/utils/jwt.guard';
import { UserDocumentType } from './types';

@Controller(Routes.USER)
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    @UseGuards(JwtGuard)
    getUsers(@Req() req: Request & { user: UserDocumentType }, @Query('name') name: string) {
        return this.userService.searchUser(req.user._id.toString(), name);
    }

    @Get('profile')
    getProfile() {
        return 'profile';
    }

    @Post('logout')
    logout() {
        return 'logout';
    }

    @Post('refresh')
    refreshToken() {
        return 'refresh';
    }
}