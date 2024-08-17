import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { AccessGuard } from 'src/utils/guards/access.guard';
import { Pagination, RequestWithUser, Routes } from 'src/utils/types';
import { FeedService } from './feed.service';

@Controller(Routes.FEED)
export class FeedController {
    constructor(private readonly feedService: FeedService) {}

    @Get()
    @UseGuards(AccessGuard)
    getFeed(@Req() req: RequestWithUser) {
        return this.feedService.getFeed({ initiatorId: req.user.doc._id });
    }

    @Get('search')
    @UseGuards(AccessGuard)
    search(@Req() req: RequestWithUser, @Query() { query, limit, page }: Pagination) {
        return this.feedService.search({ initiatorId: req.user.doc._id, query, page, limit });
    }
}