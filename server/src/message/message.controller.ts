import { Body, Controller, Delete, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { MessageService } from './message.service';
import { JwtGuard } from 'src/utils/jwt.guard';
import { MessageSendDTO } from './dtos/message.send.dto';
import { RequestWithUser, Routes } from 'src/utils/types';
import { MessageDeleteDTO } from './dtos/message.delete.dto';
import { MessageEditDTO } from './dtos/message.edit.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller(Routes.MESSAGE)
export class MessageController {
    constructor(
        private readonly messageService: MessageService,
        private readonly eventEmitter: EventEmitter2,
    ) {}

    @Post('send/:recipientId')
    @UseGuards(JwtGuard)
    async send(@Body() dto: MessageSendDTO, @Req() req: RequestWithUser, @Param('recipientId') recipientId: string) {
        return this.messageService.send({ ...dto, recipientId, initiatorId: req.user._id });
        
        // this.eventEmitter.emit("message.created", message);
    }

    @Patch('edit/:messageId')
    @UseGuards(JwtGuard)
    edit(@Body() dto: MessageEditDTO, @Param('messageId') messageId: string, @Req() req: RequestWithUser) {
        return this.messageService.edit({ ...dto, messageId, initiatorId: req.user._id });
    }

    @Delete('delete/:messageId')
    @UseGuards(JwtGuard)
    delete(@Body() dto: MessageDeleteDTO, @Param('messageId') messageId: string, @Req() req: RequestWithUser) {
        return this.messageService.delete({ ...dto, messageId, initiatorId: req.user._id });
    }
}