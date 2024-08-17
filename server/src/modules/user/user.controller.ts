import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { Pagination, RequestWithUser, Routes } from 'src/utils/types';
import { CheckType, IUserController } from './types';
import { AccessGuard } from 'src/utils/guards/access.guard';
import { UserStatusDTO } from './dtos/user.status.dto';
import { UserNameDto } from './dtos/user.name.dto';

@Controller(Routes.USER)
export class UserController implements IUserController {
    constructor(private readonly userService: UserService) {}

    @Get('search')
    @UseGuards(AccessGuard)
    search(@Req() req: RequestWithUser, @Query() { query, page, limit }: Pagination) {
        return this.userService.search({ initiatorId: req.user.doc._id, query, page, limit });
    }

    @Get('check')
    check(@Query('type') type: CheckType, @Query('email') email: string, @Query('login') login: string) {
        return this.userService.check({ type, email, login });
    }

    @Post('status')
    @UseGuards(AccessGuard)
    status(@Req() req: RequestWithUser, @Body() { status }: UserStatusDTO) {
        return this.userService.status({ initiator: req.user.doc, status });
    }

    @Post('name')
    @UseGuards(AccessGuard)
    name(@Req() req: RequestWithUser, @Body() { name }: UserNameDto) {
        return this.userService.name({ initiator: req.user.doc, name });
    }
}
