import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { RequestWithUser, Routes } from 'src/utils/types';
import { CheckType, IUserController } from './types';
import { AccessGuard } from 'src/utils/guards/access.guard';

@Controller(Routes.USER)
export class UserController implements IUserController {
    constructor(private readonly userService: UserService) {}

    @Get('search')
    @UseGuards(AccessGuard)
    search(@Req() req: RequestWithUser, @Query('query') query: string, @Query('page') page: number, @Query('limit') limit: number) {
        return this.userService.search({ initiatorId: req.user.doc._id, query, page, limit });
    }

    @Get('check')
    check(@Query('type') type: CheckType, @Query('email') email: string, @Query('login') login: string) {
        return this.userService.check({ type, email, login });
    }
}