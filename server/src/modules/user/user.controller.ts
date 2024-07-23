import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { RequestWithUser, Routes } from 'src/utils/types';
import { JwtGuard } from 'src/utils/guards/jwt.guard';
import { CheckType } from './types';

@Controller(Routes.USER)
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    @UseGuards(JwtGuard)
    getUsers(
        @Req() req: RequestWithUser,
        @Query('name') name: string,
        @Query('page') page: number,
        @Query('limit') limit: number,
    ) {
        return this.userService.searchUser({ initiatorId: req.user._id, name, page, limit });
    }

    @Get('check')
    checkEmail(@Query('type') type: CheckType, @Query('email') email: string, @Query('name') name: string) {
        return this.userService.check({ type, email, name });
    }
}
