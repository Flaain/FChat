import { Controller, Get } from '@nestjs/common';

@Controller('conversation/message')
export class MessageController {
    @Get("one")
    getOne() {
        return "one";
    }
}