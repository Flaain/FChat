import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { RequestWithUser, Routes } from 'src/utils/types';
import { SessionService } from './session.service';
import { AccessGuard } from 'src/utils/guards/access.guard';

@Controller(Routes.SESSION)
export class SessionController {
    constructor(private readonly sessionService: SessionService) {}

    @Get()
    @UseGuards(AccessGuard)
    getSessions(@Req() req: RequestWithUser) {
        return this.sessionService.getSessions({ userId: req.user.doc._id.toString(), sessionId: req.user.sessionId });
    }
}
