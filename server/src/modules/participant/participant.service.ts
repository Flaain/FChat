import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Participant } from './schemas/participant.schema';
import { FilterQuery, Model, ProjectionType, QueryOptions } from 'mongoose';

@Injectable()
export class ParticipantService {
    constructor(@InjectModel(Participant.name) private readonly participantModel: Model<Participant>) {}

    create = (participant: Participant) => this.participantModel.create(participant);

    findOneByPayload = async (
        payload: FilterQuery<Participant>,
        projection?: ProjectionType<Participant>,
        options?: QueryOptions<Participant>,
    ) => this.participantModel.findOne(payload, projection, options);

    findManyByPayload = async (
        payload: FilterQuery<Participant>,
        projection?: ProjectionType<Participant>,
        options?: QueryOptions<Participant>,
    ) => this.participantModel.find(payload, projection, options);

    insertMany = (participants: Array<Participant>) => this.participantModel.insertMany(participants);
}