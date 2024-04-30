import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { UserDocumentType } from 'src/user/types';
import { JwtGuard } from 'src/utils/jwt.guard';
import { ConversationService } from './conversation.service';
import { ConversationCreateDTO } from './dtos/conversation.create.dto';

@Controller('conversation')
export class ConversationController {
    constructor(private readonly conversationService: ConversationService) {}

    @Post('create')
    @UseGuards(JwtGuard)
    createConversation(
        @Req() req: Request & { user: UserDocumentType },
        @Body() dto: ConversationCreateDTO,
    ) {
        return this.conversationService.createConversation({
            initiator: req.user,
            ...dto,
        });
    }
}