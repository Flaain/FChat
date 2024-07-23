import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, ProjectionType, QueryOptions, Types } from 'mongoose';
import { User } from './schemas/user.schema';
import { userSearchSchema } from './schemas/user.search.schema';
import { ZodError } from 'zod';
import { AppException } from 'src/utils/exceptions/app.exception';
import { SignupRequest } from '../auth/types';
import { userCheckSchema } from './schemas/user.check.schema';
import { emailExistError, nameExistError } from '../auth/constants';
import { IAppException } from 'src/utils/types';

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
            const parsedQuery = userSearchSchema.parse({ name, page, limit }, { path: ['name'] });

            const users = await this.userModel.find(
                {
                    _id: { $ne: initiatorId },
                    name: { $regex: parsedQuery.name, $options: 'i' },
                    isPrivate: false,
                    deleted: false,
                },
                { _id: 1, name: 1 },
                { limit, skip: page * limit },
            )
            .lean();

            if (!users.length) throw new AppException({ message: "User not found" }, HttpStatus.NOT_FOUND);

            return users;
        } catch (error) {
            throw new HttpException(error instanceof ZodError ? error.issues : error.response, error.status);
        }
    };

    findById = async (id: string | Types.ObjectId) => this.userModel.findById(id);

    check = async ({ type, email, name }: { type: 'email' | 'name'; email?: string; name?: string }) => {
        const parsedQuery = userCheckSchema.parse({ type, email, name });

        const errors: Record<typeof type, Pick<IAppException, 'message' | 'errors'>> = {
            email: emailExistError,
            name: nameExistError,
        }

        const user = await this.userModel.exists({ 
            [parsedQuery.type]: { $regex: parsedQuery[parsedQuery.type], $options: 'i' }, 
            deleted: false 
        });

        if (user) throw new AppException(errors[type], HttpStatus.CONFLICT);

        return { status: HttpStatus.OK, message: 'OK' };
    }

    create = async (userDetails: SignupRequest) => {
        const { password: _, ...user } = (await new this.userModel(userDetails).save()).toObject();
        
        return user;
    };

    exists = async (filter: FilterQuery<User>) => this.userModel.exists(filter);
}