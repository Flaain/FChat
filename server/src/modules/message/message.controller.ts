import { Body, Controller, Delete, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageSendDTO } from './dtos/message.send.dto';
import { RequestWithUser, Routes } from 'src/utils/types';
import { MessageDeleteDTO } from './dtos/message.delete.dto';
import { MessageEditDTO } from './dtos/message.edit.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { STATIC_CONVERSATION_EVENTS } from '../gateway/types';
import { IMessageController } from './types';
import { AccessGuard } from 'src/utils/guards/access.guard';

@Controller(Routes.MESSAGE)
export class MessageController implements IMessageController {
    constructor(
        private readonly messageService: MessageService,
        private readonly eventEmitter: EventEmitter2,
    ) {}

    @Post('send/:recipientId')
    @UseGuards(AccessGuard)
    async send(@Req() req: RequestWithUser, @Body() dto: MessageSendDTO, @Param('recipientId') recipientId: string) {
        const { message, conversationId } = await this.messageService.send({ ...dto, recipientId, initiatorId: req.user.doc._id });

        this.eventEmitter.emit(STATIC_CONVERSATION_EVENTS.SEND_MESSAGE, {
            message,
            recipientId,
            conversationId,
            initiatorId: req.user.doc._id.toString(),
        })

        return message;
    }

    @Patch('edit/:messageId')
    @UseGuards(AccessGuard)
    async edit(@Req() req: RequestWithUser, @Body() dto: MessageEditDTO, @Param('messageId') messageId: string) {
        const { message, conversationId, isLastMessage } = await this.messageService.edit({ ...dto, messageId, initiatorId: req.user.doc._id });

        this.eventEmitter.emit(STATIC_CONVERSATION_EVENTS.EDIT_MESSAGE, { 
            message, 
            isLastMessage,
            conversationId,
            recipientId: dto.recipientId,
            initiatorId: req.user.doc._id.toString(),
        })

        return message;
    }

    @Delete('delete/:messageId')
    @UseGuards(AccessGuard)
    async delete(@Req() req: RequestWithUser, @Body() dto: MessageDeleteDTO, @Param('messageId') messageId: string) {
        const message = await this.messageService.delete({ ...dto, messageId, initiatorId: req.user.doc._id });

        this.eventEmitter.emit(STATIC_CONVERSATION_EVENTS.DELETE_MESSAGE, { messageId, initiatorId: req.user.doc._id.toString(), ...dto, ...message })

        return message;
    }
}
