import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AccessGuard } from 'src/utils/guards/access.guard';
import { RequestWithUser, Routes } from 'src/utils/types';
import { FeedService } from './feed.service';

@Controller(Routes.FEED)
export class FeedController {
    constructor(private readonly feedService: FeedService) {}

    @Get()
    @UseGuards(AccessGuard)
    getFeed(@Req() req: RequestWithUser) {
        return this.feedService.getFeed({ initiatorId: req.user.doc._id });
    }
}