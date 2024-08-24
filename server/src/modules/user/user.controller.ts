import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { Pagination, RequestWithUser, Routes } from 'src/utils/types';
import { CheckType, IUserController } from './types';
import { AccessGuard } from 'src/utils/guards/access.guard';
import { UserStatusDTO } from './dtos/user.status.dto';
import { UserNameDto } from './dtos/user.name.dto';
import { PaginationResolver } from 'src/utils/services/pagination/patination.resolver';
import { Pagination as PaginationDecorator } from 'src/utils/decorators/pagination';

@Controller(Routes.USER)
export class UserController extends PaginationResolver implements IUserController {
    constructor(private readonly userService: UserService) {
        super();
    }

    @Get('search')
    @UseGuards(AccessGuard)
    async search(@Req() req: RequestWithUser, @PaginationDecorator() params: Pagination) {
        const items = await this.userService.search({ initiatorId: req.user.doc._id, ...params });

        return this.wrapPagination({ ...params, items });
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
