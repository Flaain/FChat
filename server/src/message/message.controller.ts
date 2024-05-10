import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { MessageService } from './message.service';
import { JwtGuard } from 'src/utils/jwt.guard';
import { MessageSendDTO } from './dtos/message.send.dto';
import { UserDocumentType } from 'src/user/types';
import { Routes } from 'src/utils/types';
import { MessageDeleteDTO } from './dtos/message.delete.dto';

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

    @Delete('delete/:messageId')
    @UseGuards(JwtGuard)
    delete(@Body() dto: MessageDeleteDTO, @Param('messageId') messageId: string, @Req() req: Request & { user: UserDocumentType }) {
        return this.messageService.delete({ ...dto, messageId, initiatorId: req.user._id });
    }
}