import { Controller, Get } from '@nestjs/common';

@Controller('conversation')
export class ConversationController {
    @Get('all')
    getAll() {
        return 'all';
    }
}