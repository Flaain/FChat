import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';

@Injectable()
export class ConversationService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>,
    ) {}
}
