import { hash } from 'bcrypt';
import { HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, ProjectionType, QueryOptions, Types } from 'mongoose';
import { SignupDTO } from 'src/auth/dtos/auth.signup.dto';
import { CreateUserType } from './types';
import { USER_NOT_FOUND } from 'src/utils/constants';
import { User } from './schemas/user.schema';
import { userSearchSchema } from './schemas/user.search.schema';
import { ZodError } from 'zod';

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
                },
                { _id: 1, name: 1 },
                { limit, skip: page * limit },
            )
            .lean();

            if (!users.length) throw new HttpException(USER_NOT_FOUND, USER_NOT_FOUND.status);

            return users;
        } catch (error) {
            throw new HttpException(error instanceof ZodError ? error.issues : error.response, error.status);
        }
    };

    findById = async (id: string | Types.ObjectId) => this.userModel.findById(id);

    create = async (userDetails: SignupDTO): Promise<CreateUserType & { _id: Types.ObjectId }> => {
        const password = await hash(userDetails.password, 10);
        const { password: _, ...user } = (await new this.userModel({ ...userDetails, password }).save()).toObject();

        return user;
    };
}
