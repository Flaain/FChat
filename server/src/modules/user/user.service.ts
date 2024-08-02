import { z } from 'zod';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { HttpStatus, Injectable } from '@nestjs/common';
import { userCheckSchema } from './schemas/user.check.schema';
import { userSearchSchema } from './schemas/user.search.schema';
import { AppException } from 'src/utils/exceptions/app.exception';
import { emailExistError, loginExistError } from '../auth/constants';
import { IUserService, UserDocument, UserSearchParams } from './types';
import { FilterQuery, Model, ProjectionType, QueryOptions, Types } from 'mongoose';
import { IAppException } from 'src/utils/types';
import { SignupDTO } from '../auth/dtos/auth.signup.dto';
import { userPasswordSchema } from './schemas/user.password.schema';
import { BcryptService } from 'src/utils/services/bcrypt/bcrypt.service';
import { incorrectPasswordError } from './constants';
import { SessionService } from '../session/session.service';

@Injectable()
export class UserService implements IUserService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>, 
        private readonly bcryptService: BcryptService,
        private readonly sessionService: SessionService
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

    search = async ({ initiatorId, query, page, limit }: UserSearchParams) => {
        const parsedQuery = userSearchSchema.parse(
            { query, page: Number(page), limit: Number(limit) },
            { path: ['query'] },
        );

        const users = await this.userModel.find(
            {
                _id: { $ne: initiatorId },
                $or: [
                    { name: { $regex: parsedQuery.query, $options: 'i' } }, 
                    { login: { $regex: parsedQuery.query, $options: 'i' } }
                ],
                isPrivate: false,
                isDeleted: false,
            },
            { _id: 1, name: 1, login: 1, isOfficial: 1 },
            { limit, skip: page * limit },
        )
        .lean();

        if (!users.length) throw new AppException({ message: "No results were found for your search" }, HttpStatus.NOT_FOUND);

        return users;
    };

    findById = async (id: string | Types.ObjectId) => this.userModel.findById(id);

    password = async ({ initiator, ...dto }: z.infer<typeof userPasswordSchema> & { initiator: UserDocument }) => {
        const parsedQuery = userPasswordSchema.parse(dto);

        if (!await this.bcryptService.compareAsync(dto.currentPassword, initiator.password)) {
            throw new AppException(incorrectPasswordError, HttpStatus.CONFLICT);
        }

        if (parsedQuery.type === 'set') {
            initiator.password = await this.bcryptService.hashAsync(dto.newPassword);
            await Promise.all([initiator.save(), this.sessionService.deleteMany({ userId: initiator._id })]);
        }

        return { status: HttpStatus.OK, message: 'OK' };
    }

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

    create = async (dto: Omit<SignupDTO, 'otp'>) => {
        const { password, ...user } = (await new this.userModel(dto).save()).toObject();
        
        return user;
    };

    exists = async (filter: FilterQuery<User>) => this.userModel.exists(filter);
}