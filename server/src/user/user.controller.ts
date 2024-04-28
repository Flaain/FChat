import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { Routes } from 'src/utils/types';
import { JwtGuard } from 'src/utils/jwt.guard';

@Controller(Routes.USER)
export class UserController {
    constructor(private readonly userService: UserService) {}
    
    @Get()
    @UseGuards(JwtGuard)
    getUsers(@Query("name") name: string) {
        return this.userService.searchUser(name);
    }

    @Get('profile')
    getProfile() {
        return "profile";
    }
}
