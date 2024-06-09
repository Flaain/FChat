import { Module } from '@nestjs/common';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';
import { ParticipantModule } from 'src/participant/participant.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Group, GroupSchema } from './schemas/group.schema';

@Module({
    imports: [ParticipantModule, MongooseModule.forFeature([{ name: Group.name, schema: GroupSchema }])],
    controllers: [GroupController],
    providers: [GroupService],
    exports: [GroupService],
})
export class GroupModule {}