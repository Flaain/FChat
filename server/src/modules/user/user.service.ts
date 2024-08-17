import { z } from 'zod';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { HttpStatus, Injectable } from '@nestjs/common';
import { userCheckSchema } from './schemas/user.check.schema';
import { AppException } from 'src/utils/exceptions/app.exception';
import { emailExistError, loginExistError } from '../auth/constants';
import { IUserService, UserDocument, UserSearchParams } from './types';
import { FilterQuery, Model, ProjectionType, QueryOptions, Types } from 'mongoose';
import { IAppException } from 'src/utils/types';
import { SignupDTO } from '../auth/dtos/auth.signup.dto';
import { UserStatusDTO } from './dtos/user.status.dto';
import { UserNameDto } from './dtos/user.name.dto';
import { searchSchema } from 'src/utils/schemas/search.schema';
import { noSearchResults } from 'src/utils/constants';

@Injectable()
export class UserService implements IUserService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>, 
    ) {}

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

    search = async ({ initiatorId, query, page = 0, limit = 10 }: UserSearchParams) => {
        const parsedQuery = searchSchema.parse({ query, page, limit }, { path: ['query'] });

        const users = await this.userModel
            .find(
                {
                    _id: { $ne: initiatorId },
                    $or: [
                        { name: { $regex: parsedQuery.query, $options: 'i' } },
                        { login: { $regex: parsedQuery.query, $options: 'i' } },
                    ],
                    isPrivate: false,
                    isDeleted: false,
                },
                { _id: 1, name: 1, login: 1, isOfficial: 1 },
                { limit, skip: page * limit, sort: { createdAt: -1 } },
            )
            .lean();

        if (!users.length) throw new AppException(noSearchResults, HttpStatus.NOT_FOUND);

        return users;
    };

    findById = async (id: string | Types.ObjectId) => this.userModel.findById(id);

    check = async (dto: z.infer<typeof userCheckSchema>) => {
        const parsedQuery = userCheckSchema.parse(dto);

        const errors: Record<typeof parsedQuery.type, Pick<IAppException, 'message' | 'errors'>> = {
            email: emailExistError,
            login: loginExistError,
        }

        const user = await this.userModel.exists({ 
            [parsedQuery.type]: { $regex: parsedQuery[parsedQuery.type], $options: 'i' }, 
            isDeleted: false 
        });

        if (user) throw new AppException(errors[parsedQuery.type], HttpStatus.CONFLICT);

        return { status: HttpStatus.OK, message: 'OK' };
    }

    status = async ({ initiator, status }: UserStatusDTO & { initiator: UserDocument }) => {
        const trimmedStatus = status.trim();

        if (initiator.status === trimmedStatus) return { status: HttpStatus.OK, message: 'OK' };
        
        initiator.status = trimmedStatus.length ? trimmedStatus : undefined;

        await initiator.save();

        return { status: HttpStatus.OK, message: 'OK' };
    }

    name = async ({ initiator, name }: UserNameDto & { initiator: UserDocument }) => {
        initiator.name = name.trim();

        await initiator.save();

        return { status: HttpStatus.OK, message: 'OK' };
    }

    create = async (dto: Omit<SignupDTO, 'otp'>) => {
        const { password, ...user } = (await new this.userModel(dto).save()).toObject();
        
        return user;
    };

    exists = async (filter: FilterQuery<User>) => this.userModel.exists(filter);
}