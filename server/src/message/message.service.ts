import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from './schemas/message.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class MessageService {
    constructor(@InjectModel(Message.name) private readonly messageModel: Model<Message>) {}

    create = async () => {
        this.messageModel.create({
            sender: new Types.ObjectId("661c0a4c34f23550f54a2ad2"),
            text: "all good",
        })
    };
}
