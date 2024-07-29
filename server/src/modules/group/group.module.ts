import { Module } from '@nestjs/common';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Group, GroupSchema } from './schemas/group.schema';
import { ParticipantModule } from '../participant/participant.module';

@Module({
    imports: [ParticipantModule, MongooseModule.forFeature([{ name: Group.name, schema: GroupSchema }])],
    controllers: [GroupController],
    providers: [GroupService],
    exports: [GroupService],
})
export class GroupModule {}