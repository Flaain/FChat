import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { MessageService } from './message.service';
import { JwtGuard } from 'src/utils/jwt.guard';
import { MessageSendDTO } from './dtos/message.send.dto';
import { UserDocumentType } from 'src/user/types';
import { Routes } from 'src/utils/types';
import { MessageDeleteDTO } from './dtos/message.delete.dto';
import { MessageEditDTO } from './dtos/message.edit.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller(Routes.MESSAGE)
export class MessageController {
    constructor(
        private readonly messageService: MessageService,
        private readonly eventEmitter: EventEmitter2,
    ) {}

    @Post('send/:conversationId')
    @UseGuards(JwtGuard)
    send(
        @Body() dto: MessageSendDTO,
        @Req() req: Request & { user: UserDocumentType },
        @Param('conversationId') conversationId: string,
    ) {
        return this.messageService.send({ ...dto, conversationId, initiatorId: req.user._id });
    }

    @Patch('edit/:messageId')
    @UseGuards(JwtGuard)
    edit(
        @Body() dto: MessageEditDTO,
        @Param('messageId') messageId: string,
        @Req() req: Request & { user: UserDocumentType },
    ) {
        return this.messageService.edit({ ...dto, messageId, initiatorId: req.user._id });
    }

    @Delete('delete/:messageId')
    @UseGuards(JwtGuard)
    delete(
        @Body() dto: MessageDeleteDTO,
        @Param('messageId') messageId: string,
        @Req() req: Request & { user: UserDocumentType },
    ) {
        return this.messageService.delete({ ...dto, messageId, initiatorId: req.user._id });
    }
}