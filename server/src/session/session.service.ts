import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Session } from './schemas/session.schema';

@Injectable()
export class SessionService {
    constructor(@InjectModel(Session.name) private readonly sessionModel: Model<Session>) {}

    create = ({ userId, userAgent, expiresAt }: Omit<Session, 'createdAt'>) => this.sessionModel.create({ userId, userAgent, expiresAt });
}