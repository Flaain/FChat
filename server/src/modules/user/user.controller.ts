import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { RequestWithUser, Routes } from 'src/utils/types';
import { ActionPasswordType, CheckType, IUserController } from './types';
import { AccessGuard } from 'src/utils/guards/access.guard';
import { UserPasswordDto } from './dtos/user.password.dto';
import { UserStatusDTO } from './dtos/user.status.dto';

@Controller(Routes.USER)
export class UserController implements IUserController {
    constructor(private readonly userService: UserService) {}

    @Get('search')
    @UseGuards(AccessGuard)
    search(
        @Req() req: RequestWithUser,
        @Query('query') query: string,
        @Query('page') page: number,
        @Query('limit') limit: number,
    ) {
        return this.userService.search({ initiatorId: req.user.doc._id, query, page, limit });
    }

    @Get('check')
    check(@Query('type') type: CheckType, @Query('email') email: string, @Query('login') login: string) {
        return this.userService.check({ type, email, login });
    }

    @Post('password')
    @UseGuards(AccessGuard)
    password(@Req() req: RequestWithUser, @Body() dto: UserPasswordDto, @Query('type') type: ActionPasswordType) {
        return this.userService.password({ initiator: req.user.doc, type, ...dto });
    }

    @Post('status')
    @UseGuards(AccessGuard)
    status(@Req() req: RequestWithUser, @Body() { status }: UserStatusDTO) {
        return this.userService.status({ initiator: req.user.doc, status });
    }
}
