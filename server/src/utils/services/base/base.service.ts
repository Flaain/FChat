import { Injectable } from '@nestjs/common';
import {
    Document,
    FilterQuery,
    InsertManyOptions,
    Model,
    MongooseUpdateQueryOptions,
    ProjectionType,
    QueryOptions,
    Types,
    UpdateQuery,
    UpdateWithAggregationPipeline,
} from 'mongoose';

@Injectable()
export class BaseService<Doc extends Document, Entity> {
    constructor(private readonly model: Model<Doc>) {}

    create = (body: Omit<Entity, '_id' | 'created'>) => this.model.create(body);
    total = (filter: FilterQuery<Doc>, projection?: ProjectionType<Doc>, options?: QueryOptions<Doc>) => this.model.find(filter, projection, options).countDocuments();
    findOne = (filter: FilterQuery<Doc>, projection?: ProjectionType<Doc>, options?: QueryOptions<Doc>) => this.model.findOne(filter, projection, options);
    insertMany = <T>(array: Array<T>, options?: InsertManyOptions) => this.model.insertMany(array, options);
    findById = (id: Types.ObjectId | string, projection?: ProjectionType<Doc>, options?: QueryOptions<Doc>) => this.model.findById(id, projection, options);
    find = (filter: FilterQuery<Doc>, projection?: ProjectionType<Doc>, options?: QueryOptions<Doc>) => this.model.find(filter, projection, options);
    exists = (filter: FilterQuery<Doc>) => this.model.exists(filter);
    findOneAndDelete = (filter: FilterQuery<Doc>, options: QueryOptions<Doc> = {}) => this.model.findOneAndDelete(filter, { new: true, ...options });
    deleteMany = (filter: FilterQuery<Doc>) => this.model.deleteMany(filter);
    
    updateOne = (
        filter: FilterQuery<Doc>,
        update?: UpdateQuery<Doc> | UpdateWithAggregationPipeline,
        options?: MongooseUpdateQueryOptions<Doc>,
    ) => {
        return this.model.updateOne(filter, update, options);
    };

    updateMany = (
        filter: FilterQuery<Doc>,
        update?: UpdateQuery<Doc> | UpdateWithAggregationPipeline,
        options?: MongooseUpdateQueryOptions<Doc>,
    ) => {
        return this.model.updateMany(filter, update, options);
    };

    findOneAndUpdate = (filter: FilterQuery<Doc>, update?: UpdateQuery<Doc>, options: QueryOptions<Doc> = {}) => this.model.findOneAndUpdate(filter, update, { 
        new: true, 
        ...options 
    });
}