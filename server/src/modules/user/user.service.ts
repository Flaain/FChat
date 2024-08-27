import { z } from 'zod';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { HttpStatus, Injectable } from '@nestjs/common';
import { userCheckSchema } from './schemas/user.check.schema';
import { AppException } from 'src/utils/exceptions/app.exception';
import { emailExistError, loginExistError } from '../auth/constants';
import { IUserService, UserDocument, UserSearchParams } from './types';
import { Model, isValidObjectId } from 'mongoose';
import { IAppException } from 'src/utils/types';
import { UserStatusDTO } from './dtos/user.status.dto';
import { UserNameDto } from './dtos/user.name.dto';
import { BaseService } from 'src/utils/services/base/base.service';

@Injectable()
export class UserService extends BaseService<UserDocument, User> implements IUserService {
    constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {
        super(userModel);
    }

    block = async ({ initiator, recipientId }: { initiator: UserDocument; recipientId: string }) => {
        if (!isValidObjectId(recipientId) || initiator._id.toString() === recipientId || initiator.blockList.some((id) => id.toString() === recipientId)) {
            throw new AppException({ message: 'Cannot block user' }, HttpStatus.BAD_REQUEST);
        }

        const recipient = await this.findById(recipientId);

        if (!recipient) throw new AppException({ message: 'User not found' }, HttpStatus.NOT_FOUND);

        await this.updateOne({ _id: initiator._id }, { $addToSet: { blockList: recipient._id } });

        return { recipientId: recipient._id.toString() };
    }

    unblock = async ({ initiator, recipientId }: { initiator: UserDocument; recipientId: string }) => {
        if (!isValidObjectId(recipientId) || initiator._id.toString() === recipientId || !initiator.blockList.some((id) => id.toString() === recipientId)) {
            throw new AppException({ message: 'Cannot unblock user' }, HttpStatus.BAD_REQUEST);
        }

        const recipient = await this.findById(recipientId);

        if (!recipient) throw new AppException({ message: 'User not found' }, HttpStatus.NOT_FOUND);

        await this.updateOne({ _id: initiator._id }, { $pull: { blockList: recipient._id } });

        return { recipientId: recipient._id.toString() };
    }

    search = async ({ initiatorId, query, page, limit }: UserSearchParams) => {
        const users = await this.find(
            {
                _id: { $ne: initiatorId },
                $or: [{ name: { $regex: query, $options: 'i' } }, { login: { $regex: query, $options: 'i' } }],
                isPrivate: false,
                isDeleted: false,
            },
            { _id: 1, name: 1, login: 1, isOfficial: 1 },
            { limit, skip: page * limit, sort: { createdAt: -1 } },
        ).lean();

        return users;
    };

    check = async (dto: z.infer<typeof userCheckSchema>) => {
        const parsedQuery = userCheckSchema.parse(dto);

        const errors: Record<typeof parsedQuery.type, Pick<IAppException, 'message' | 'errors'>> = {
            email: emailExistError,
            login: loginExistError,
        };

        const user = await this.exists({
            [parsedQuery.type]: { $regex: parsedQuery[parsedQuery.type], $options: 'i' },
            isDeleted: false,
        });

        if (user) throw new AppException(errors[parsedQuery.type], HttpStatus.CONFLICT);

        return { status: HttpStatus.OK, message: 'OK' };
    };

    status = async ({ initiator, status }: UserStatusDTO & { initiator: UserDocument }) => {
        const trimmedStatus = status.trim();

        if (initiator.status === trimmedStatus) return { status: HttpStatus.OK, message: 'OK' };

        initiator.status = trimmedStatus.length ? trimmedStatus : undefined;

        await initiator.save();

        return { status: HttpStatus.OK, message: 'OK' };
    };

    name = async ({ initiator, name }: UserNameDto & { initiator: UserDocument }) => {
        initiator.name = name.trim();

        await initiator.save();

        return { status: HttpStatus.OK, message: 'OK' };
    };
}