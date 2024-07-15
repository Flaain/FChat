import { Body, Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/utils/jwt.guard';
import { ConversationService } from './conversation.service';
import { ConversationCreateDTO } from './dtos/conversation.create.dto';
import { RequestWithUser, Routes } from 'src/utils/types';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { STATIC_CONVERSATION_EVENTS } from 'src/gateway/types';

@Controller(Routes.CONVERSATION)
export class ConversationController {
    constructor(
        private readonly conversationService: ConversationService,
        private readonly eventEmitter: EventEmitter2,
    ) {}

    @Get()
    @UseGuards(JwtGuard)
    getConversations(@Req() req: RequestWithUser, @Query('cursor') cursor?: string) {
        return this.conversationService.getConversations({ initiatorId: req.user._id, cursor });
    }

    @Post('create')
    @UseGuards(JwtGuard)
    async createConversation(@Req() req: RequestWithUser, @Body() dto: ConversationCreateDTO) {
        const conversation = await this.conversationService.createConversation({ initiatorId: req.user._id, ...dto });

        this.eventEmitter.emit(STATIC_CONVERSATION_EVENTS.CREATED, {
            initiatorId: req.user._id.toString(),
            recipient: conversation.recipient,
            conversationId: conversation._id,
            lastMessageSentAt: conversation.lastMessageSentAt,
        });

        return conversation;
    }

    @Delete('/delete/:id')
    @UseGuards(JwtGuard)
    async deleteConversation(@Req() req: RequestWithUser, @Param('id') id: string) {
        return this.conversationService.deleteConversation({ initiatorId: req.user._id, conversationId: id });
    }

    @Get(':id')
    @UseGuards(JwtGuard)
    getConversation(@Req() req: RequestWithUser, @Param('id') id: string, @Query('cursor') cursor?: string) {
        return this.conversationService.getConversation({ initiator: req.user, recipientId: id, cursor });
    }
}