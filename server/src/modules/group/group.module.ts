import { Module } from '@nestjs/common';
import { GroupController } from './group.controller';
import { GroupService } from './group.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Group, GroupSchema, Invite, InviteSchema } from './schemas/group.schema';
import { ParticipantModule } from '../participant/participant.module';
import { UserModule } from '../user/user.module';

@Module({
    imports: [
        ParticipantModule,
        UserModule,
        MongooseModule.forFeature([
            { name: Group.name, schema: GroupSchema },
            { name: Invite.name, schema: InviteSchema },
        ]),
    ],
    controllers: [GroupController],
    providers: [GroupService],
    exports: [GroupService],
})
export class GroupModule {}