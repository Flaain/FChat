import { Module } from '@nestjs/common';
import { GroupMessageService } from './group-message.service';
import { GroupMessageController } from './group-message.controller';

@Module({
  providers: [GroupMessageService],
  controllers: [GroupMessageController]
})
export class GroupMessageModule {}
