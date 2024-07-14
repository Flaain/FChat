import { Body, Controller, Delete, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { MessageService } from './message.service';
import { JwtGuard } from 'src/utils/jwt.guard';
import { MessageSendDTO } from './dtos/message.send.dto';
import { RequestWithUser, Routes } from 'src/utils/types';
import { MessageDeleteDTO } from './dtos/message.delete.dto';
import { MessageEditDTO } from './dtos/message.edit.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { STATIC_CONVERSATION_EVENTS } from 'src/gateway/types';

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

        this.eventEmitter.emit(STATIC_CONVERSATION_EVENTS.SEND_MESSAGE, {
            message,
            recipientId,
            initiatorId: req.user._id.toString(),
            conversationId: message.conversationId
        })

        return message;
    }

    @Patch('edit/:messageId')
    @UseGuards(JwtGuard)
    edit(@Body() dto: MessageEditDTO, @Param('messageId') messageId: string, @Req() req: RequestWithUser) {
        return this.messageService.edit({ ...dto, messageId, initiatorId: req.user._id });
    }

    @Delete('delete/:messageId')
    @UseGuards(JwtGuard)
    async delete(@Body() dto: MessageDeleteDTO, @Param('messageId') messageId: string, @Req() req: RequestWithUser) {
        const message = await this.messageService.delete({ ...dto, messageId, initiatorId: req.user._id });

        this.eventEmitter.emit(STATIC_CONVERSATION_EVENTS.DELETE_MESSAGE, { messageId, initiatorId: req.user._id.toString(), ...dto, ...message })

        return message;
    }
}
