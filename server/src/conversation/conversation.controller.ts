import { Controller, Post } from '@nestjs/common';

@Controller('conversation')
export class ConversationController {
    @Post('create')
    createConversation() {}
}