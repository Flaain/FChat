import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { MessageService } from './message.service';
import { JwtGuard } from 'src/utils/jwt.guard';
import { MessageSendDTO } from './dtos/message.send.dto';
import { UserDocumentType } from 'src/user/types';
import { Routes } from 'src/utils/types';

@Controller(Routes.MESSAGE)
export class MessageController {
    constructor(private readonly messageService: MessageService) {}

    @Post('send/:conversationId')
    @UseGuards(JwtGuard)
    send(
        @Body() dto: MessageSendDTO,
        @Req() req: Request & { user: UserDocumentType },
        @Param('conversationId') conversationId: string,
    ) {
        return this.messageService.send({ ...dto, conversationId, initiatorId: req.user._id });
    }
}