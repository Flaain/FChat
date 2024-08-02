import { FilterQuery, Model, Types } from 'mongoose';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Session } from './schemas/session.schema';
import { AppException } from 'src/utils/exceptions/app.exception';
import { AppExceptionCode } from 'src/utils/types';

@Injectable()
export class SessionService {
    constructor(@InjectModel(Session.name) private readonly sessionModel: Model<Session>) {}

    create = ({ userId, userAgent, expiresAt }: Omit<Session, 'createdAt'>) => this.sessionModel.create({ userId, userAgent, expiresAt });
    findById = (id: Types.ObjectId | string) => this.sessionModel.findById(id);
    findOneByPayload = (payload: FilterQuery<Session>) => this.sessionModel.findOne(payload);
    findManyByPayload = (payload: FilterQuery<Session>) => this.sessionModel.find(payload);
    deleteMany = (payload: FilterQuery<Session>) => this.sessionModel.deleteMany(payload);

    validate = async (_id: Types.ObjectId | string) => {
        const session = await this.findById(_id);

        if (!session || new Date(session.expiresAt).getTime() <= Date.now()) {
            throw new AppException({ 
                message: "Session expired", 
                errorCode: AppExceptionCode.REFRESH_DENIED 
            }, HttpStatus.UNAUTHORIZED);
        }

        return session;
    };
}