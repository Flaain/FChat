import { Controller, Get } from '@nestjs/common';

@Controller('message')
export class MessageController {
    @Get("one")
    getOne() {
        return "one";
    }
}