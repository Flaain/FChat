import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { UserDocumentType } from 'src/user/types';
import { JwtGuard } from 'src/utils/jwt.guard';
import { ConversationService } from './conversation.service';
import { ConversationCreateDTO } from './dtos/conversation.create.dto';
import { Routes } from 'src/utils/types';

@Controller(Routes.CONVERSATION)
export class ConversationController {
    constructor(private readonly conversationService: ConversationService) {}

    @Post('create')
    @UseGuards(JwtGuard)
    createConversation(@Req() req: Request & { user: UserDocumentType }, @Body() dto: ConversationCreateDTO) {
        return this.conversationService.createConversation({
            initiator: req.user,
            ...dto,
        });
    }

    @Get(':id')
    @UseGuards(JwtGuard)
    getConversation(@Req() req: Request & { user: UserDocumentType }, @Param("id") id: string) {
        return this.conversationService.getConversation(req.user._id, id);
    }
}
