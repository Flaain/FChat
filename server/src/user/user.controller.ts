import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { RequestWithUser, Routes } from 'src/utils/types';
import { JwtGuard } from 'src/utils/jwt.guard';

@Controller(Routes.USER)
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    @UseGuards(JwtGuard)
    getUsers(
        @Req() req: RequestWithUser,
        @Query('name') name: string,
        @Query('page', { transform: (value) => Number(value) || 0 }) page: number,
        @Query('limit', { transform: (value) => Number(value) || 10 }) limit: number,
    ) {
        return this.userService.searchUser({ initiatorId: req.user._id, name, page, limit });
    }
}