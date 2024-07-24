import { Body, Controller, Delete, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { MessageService } from './message.service';
import { JwtGuard } from 'src/utils/guards/jwt.guard';
import { MessageSendDTO } from './dtos/message.send.dto';
import { RequestWithUser, Routes } from 'src/utils/types';
import { MessageDeleteDTO } from './dtos/message.delete.dto';
import { MessageEditDTO } from './dtos/message.edit.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { STATIC_CONVERSATION_EVENTS } from '../gateway/types';
import { IMessageController } from './types';

@Controller(Routes.MESSAGE)
export class MessageController implements IMessageController {
    constructor(
        private readonly messageService: MessageService,
        private readonly eventEmitter: EventEmitter2,
    ) {}

    @Post('send/:recipientId')
    @UseGuards(JwtGuard)
    async send(@Req() req: RequestWithUser, @Body() dto: MessageSendDTO, @Param('recipientId') recipientId: string) {
        const { message, conversationId } = await this.messageService.send({ ...dto, recipientId, initiatorId: req.user._id });

        this.eventEmitter.emit(STATIC_CONVERSATION_EVENTS.SEND_MESSAGE, {
            message,
            recipientId,
            conversationId,
            initiatorId: req.user._id.toString(),
        })

        return message;
    }

    @Patch('edit/:messageId')
    @UseGuards(JwtGuard)
    async edit(@Req() req: RequestWithUser, @Body() dto: MessageEditDTO, @Param('messageId') messageId: string) {
        const { message, conversationId } = await this.messageService.edit({ ...dto, messageId, initiatorId: req.user._id });

        this.eventEmitter.emit(STATIC_CONVERSATION_EVENTS.EDIT_MESSAGE, { 
            message, 
            conversationId,
            recipientId: dto.recipientId,
            initiatorId: req.user._id.toString(),
        })

        return message;
    }

    @Delete('delete/:messageId')
    @UseGuards(JwtGuard)
    async delete(@Req() req: RequestWithUser, @Body() dto: MessageDeleteDTO, @Param('messageId') messageId: string) {
        const message = await this.messageService.delete({ ...dto, messageId, initiatorId: req.user._id });

        this.eventEmitter.emit(STATIC_CONVERSATION_EVENTS.DELETE_MESSAGE, { messageId, initiatorId: req.user._id.toString(), ...dto, ...message })

        return message;
    }
}
