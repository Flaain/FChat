import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/utils/jwt.guard';
import { ConversationService } from './conversation.service';
import { ConversationCreateDTO } from './dtos/conversation.create.dto';
import { RequestWithUser, Routes } from 'src/utils/types';

@Controller(Routes.CONVERSATION)
export class ConversationController {
    constructor(private readonly conversationService: ConversationService) {}

    @Get()
    @UseGuards(JwtGuard)
    getConversations(@Req() req: RequestWithUser, @Query('cursor') cursor?: string) {
        return this.conversationService.getConversations({ initiatorId: req.user._id, cursor });
    }

    @Post('create')
    @UseGuards(JwtGuard)
    createConversation(@Req() req: RequestWithUser, @Body() dto: ConversationCreateDTO) {
        return this.conversationService.createConversation({
            initiatorId: req.user._id,
            ...dto,
        });
    }

    @Get(':id')
    @UseGuards(JwtGuard)
    getConversation(
        @Req() req: RequestWithUser,
        @Param('id') id: string,
        @Query('cursor') cursor?: string,
    ) {
        return this.conversationService.getConversation({
            initiator: req.user,
            recipientId: id,
            cursor,
        });
    }
}