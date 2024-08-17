import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Group, Invite } from './schemas/group.schema';
import { FilterQuery, Model, ProjectionType, QueryOptions } from 'mongoose';
import { UserService } from '../user/user.service';
import { AppException } from 'src/utils/exceptions/app.exception';
import { loginExistError } from '../auth/constants';
import { CreateGroupDTO } from './dtos/create.group.dto';
import { UserDocument } from '../user/types';
import { ParticipantService } from '../participant/participant.service';
import { GroupView } from './types';

@Injectable()
export class GroupService {
    constructor(
        @InjectModel(Group.name) private readonly groupModel: Model<Group>,
        @InjectModel(Invite.name) private readonly inviteModel: Model<Invite>,
        private readonly userService: UserService,
        private readonly participantService: ParticipantService,
    ) {}

    findManyByPayload = async (
        payload: FilterQuery<Group>,
        projection?: ProjectionType<Group>,
        options?: QueryOptions<Group>,
    ) => this.groupModel.find(payload, projection, options);

    findOneByPayload = async (
        payload: FilterQuery<Group>,
        projection?: ProjectionType<Group>,
        options?: QueryOptions<Group>,
    ) => this.groupModel.findOne(payload, projection, options);

    create = async ({ login, name, initiator, participants: dtoParticipants }: CreateGroupDTO & { initiator: UserDocument }) => {
        if ((await this.groupModel.exists({ login })) || (await this.userService.exists({ login }))) {
            throw new AppException(loginExistError, HttpStatus.CONFLICT);
        }

        const findedUsers = await this.userService.findManyByPayload(
            {
                _id: { $in: dtoParticipants, $ne: initiator._id },
                isDeleted: false,
                isPrivate: false,
            },
            {
                _id: 1,
            },
        );
        const group = await this.groupModel.create({ login, owner: initiator._id, name, participants: [] });
        const participants = await this.participantService.insertMany([initiator, ...findedUsers].map((user) => ({ userId: user._id, groupId: group._id })));
        
        group.participants = participants.map((participant) => participant._id);
        group.owner = participants[0]._id;

        await group.save();

        return { _id: group._id.toString() };
    };

    getGroup = async ({ initiator, groupId, invite }: { initiator: UserDocument; groupId: string; invite: string }) => {
        const group = await this.groupModel.findById(groupId);

        if (!group) throw new AppException({ message: 'Group not found' }, HttpStatus.NOT_FOUND);

        const participant = await this.participantService.findOneByPayload({ userId: initiator._id, groupId: group._id });

        if (participant) {
            const populatedGroup = await group.populate({
                path: 'participants',
                model: 'Participant',
                populate: {
                    path: 'userId',
                    model: 'User',
                    select: { login: 1, name: 1 },
                },
                match: { _id: { $ne: participant._id } },
            });

            return { ...populatedGroup.toObject(), displayAs: GroupView.PARTICIPANT };
        }

        if (group.isPrivate) {
            const isInviteExist = invite ? await this.inviteModel.exists({ code: invite, groupId: group._id }) : false;
            const { _id, isOfficial, name, login } = group.toObject();

            return {
                _id,
                login,
                name,
                isOfficial,
                displayAs: isInviteExist ? GroupView.JOIN : GroupView.REQUEST,
            }
        } else {
            const populatedGroup = await group.populate({
                path: 'participants',
                model: 'Participant',
                populate: {
                    path: 'userId',
                    model: 'User',
                    select: { login: 1, name: 1 },
                },
                match: { _id: { $ne: participant._id } },
            });

            return { ...populatedGroup.toObject(), displayAs: GroupView.GUEST };
        }
    }
}