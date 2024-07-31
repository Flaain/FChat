import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Group } from './schemas/group.schema';
import { FilterQuery, Model, ProjectionType, QueryOptions } from 'mongoose';

@Injectable()
export class GroupService {
    constructor(
        @InjectModel(Group.name) private readonly groupModel: Model<Group>,
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
}