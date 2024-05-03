import { Controller, Get, Post } from '@nestjs/common';
import { MessageService } from './message.service';

@Controller('message')
export class MessageController {
    constructor(private readonly messageService: MessageService) {}

    @Post("one")
    getOne() {
        this.messageService.create();
    }
}