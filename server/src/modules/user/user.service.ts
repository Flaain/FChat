import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, ProjectionType, QueryOptions, Types } from 'mongoose';
import { User } from './schemas/user.schema';
import { userSearchSchema } from './schemas/user.search.schema';
import { ZodError } from 'zod';
import { AppException } from 'src/utils/exceptions/app.exception';
import { errorMessages } from 'src/utils/constants';
import { SignupRequest } from '../auth/types';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

    findOneByPayload = async (
        payload: FilterQuery<User>,
        projection?: ProjectionType<User>,
        options?: QueryOptions<User>,
    ) => this.userModel.findOne(payload, projection, options);

    findManyByPayload = async (
        payload: FilterQuery<User>,
        projection?: ProjectionType<User>,
        options?: QueryOptions<User>,
    ) => this.userModel.find(payload, projection, options);

    searchUser = async ({
        initiatorId,
        name,
        page,
        limit,
    }: {
        initiatorId: Types.ObjectId;
        name: string;
        page: number;
        limit: number;
    }) => {
        try {
            const parsedQuery = userSearchSchema.parse(name, { path: ['name'] });

            const users = await this.userModel.find(
                {
                    _id: { $ne: initiatorId },
                    name: { $regex: parsedQuery, $options: 'i' },
                    isPrivate: false,
                    deleted: false,
                },
                { _id: 1, name: 1 },
                { limit, skip: page * limit },
            )
            .lean();

            if (!users.length) throw new AppException({ message: errorMessages.userNotFound }, HttpStatus.NOT_FOUND);

            return users;
        } catch (error) {
            throw new HttpException(error instanceof ZodError ? error.issues : error.response, error.status);
        }
    };

    findById = async (id: string | Types.ObjectId) => this.userModel.findById(id);

    create = async (userDetails: SignupRequest) => {
        const { password: _, ...user } = (await new this.userModel(userDetails).save()).toObject();
        
        return user;
    };

    exists = async (filter: FilterQuery<User>) => this.userModel.exists(filter);
}