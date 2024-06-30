import { Body, Controller, Delete, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { MessageService } from './message.service';
import { JwtGuard } from 'src/utils/jwt.guard';
import { MessageSendDTO } from './dtos/message.send.dto';
import { RequestWithUser, Routes } from 'src/utils/types';
import { MessageDeleteDTO } from './dtos/message.delete.dto';
import { MessageEditDTO } from './dtos/message.edit.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EVENT_EMITTER } from 'src/gateway/types';

@Controller(Routes.MESSAGE)
export class MessageController {
    constructor(
        private readonly messageService: MessageService,
        private readonly eventEmitter: EventEmitter2,
    ) {}

    @Post('send/:recipientId')
    @UseGuards(JwtGuard)
    async send(@Body() dto: MessageSendDTO, @Req() req: RequestWithUser, @Param('recipientId') recipientId: string) {
        const message = await this.messageService.send({ ...dto, recipientId, initiatorId: req.user._id });
        
        return this.eventEmitter.emit(EVENT_EMITTER.CONVERSATION_SEND_MESSAGE, { message, recipientId, initiatorId: req.user._id.toString() });
    }

    @Patch('edit/:messageId')
    @UseGuards(JwtGuard)
    async edit(@Body() dto: MessageEditDTO, @Param('messageId') messageId: string, @Req() req: RequestWithUser) {
        const message = await this.messageService.edit({ ...dto, messageId, initiatorId: req.user._id });

        return this.eventEmitter.emit(EVENT_EMITTER.CONVERSATION_EDIT_MESSAGE, { message, initiatorId: req.user._id.toString(), recipientId: dto.recipientId });
    }

    @Delete('delete/:messageId')
    @UseGuards(JwtGuard)
    delete(@Body() dto: MessageDeleteDTO, @Param('messageId') messageId: string, @Req() req: RequestWithUser) {
        return this.messageService.delete({ ...dto, messageId, initiatorId: req.user._id });
    }
}