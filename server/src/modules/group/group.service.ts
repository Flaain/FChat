import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Group } from './schemas/group.schema';
import { FilterQuery, Model, ProjectionType, QueryOptions } from 'mongoose';
import { UserService } from '../user/user.service';
import { AppException } from 'src/utils/exceptions/app.exception';
import { loginExistError } from '../auth/constants';
import { CreateGroupDTO } from './dtos/create.group.dto';
import { UserDocument } from '../user/types';
import { ParticipantService } from '../participant/participant.service';

@Injectable()
export class GroupService {
    constructor(
        @InjectModel(Group.name) private readonly groupModel: Model<Group>,
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

    create = async ({ login, name, initiator, participants }: CreateGroupDTO & { initiator: UserDocument }) => {
        if ((await this.groupModel.exists({ login })) || (await this.userService.exists({ login }))) {
            throw new AppException(loginExistError, HttpStatus.CONFLICT);
        }

        const findedUsers = await this.userService.findManyByPayload({ _id: { $in: participants }, isDeleted: false, isPrivate: false });
        const group = await this.groupModel.create({ login, displayName: name, owner: initiator._id, participants: [] });

        group.participants = (await this.participantService.insertMany(findedUsers.map((user) => ({ userId: user._id, groupId: group._id })))).map((participant) => participant._id);

        await group.save();

        return { _id: group._id.toString() };
    };
}