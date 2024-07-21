import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Group } from './schemas/group.schema';
import { Model, Types } from 'mongoose';
import { ParticipantService } from 'src/participant/participant.service';

@Injectable()
export class GroupService {
    constructor(
        @InjectModel(Group.name) private readonly groupModel: Model<Group>,
        private readonly paricipantService: ParticipantService,
    ) {}

    getGroups = async ({ initiatorId, cursor }: { initiatorId: Types.ObjectId; cursor?: string }) => {
        try {
            const GROUP_BATCH = 10;

            let nextCursor: string | null = null;

            const participants = await this.paricipantService.findManyByPayload({ user: initiatorId });

            if (!participants.length) return { groups: [], nextCursor: null };

            const groupIds = participants.map((participant) => participant.group);

            const groups = await this.groupModel.find(
                { _id: { $in: groupIds }, ...(cursor && { lastMessageSentAt: { $lt: cursor } }) },
                { lastMessage: 1, lastMessageSentAt: 1, displayName: 1, official: 1 },
                {
                    limit: GROUP_BATCH,
                    populate: {
                        path: 'lastMessage',
                        select: 'text sender',
                        populate: { path: 'sender', select: 'name' },
                    },
                    sort: { lastMessageSentAt: -1 },
                },
            );

            groups.length === GROUP_BATCH && (nextCursor = groups[groups.length - 1].lastMessageSentAt.toISOString());

            return { groups, nextCursor };
        } catch (error) {
            console.log(error);
            return { groups: [], nextCursor: null };
        }
    };
}