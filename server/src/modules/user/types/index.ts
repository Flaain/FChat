import { z } from 'zod';
import { User } from '../schemas/user.schema';
import { userSearchSchema } from '../schemas/user.search.schema';
import { Document, FilterQuery, ProjectionType, QueryOptions, SchemaTimestampsConfig, Types } from 'mongoose';
import { HttpStatus } from '@nestjs/common';
import { RequestWithUser } from 'src/utils/types';
import { userCheckSchema } from '../schemas/user.check.schema';
import { SignupDTO } from 'src/modules/auth/dtos/auth.signup.dto';

export type CheckType = 'email' | 'login';
export type UserWithoutPassword = Omit<IUser, 'password'>;
export type UserDocument = User & Document & SchemaTimestampsConfig;
export type UserSearchParams = z.infer<typeof userSearchSchema> & { initiatorId: Types.ObjectId };

export interface IUser {
    _id: Types.ObjectId;
    password: string;
    name: string;
    login: string;
    email: string;
    birthDate: Date;
    lastSeenAt: Date;
    isPrivate: boolean;
    isDeleted: boolean;
    isOfficial: boolean;
}

export interface IUserController {
    check(type: CheckType, email: string, login: string): Promise<{ status: HttpStatus; message: string }>;
    search(req: RequestWithUser, query: string, page: number, limit: number): Promise<Array<Pick<IUser, '_id' | 'name' | 'login'>>>;
}

export interface IUserService {
    check: ({ type, email, login }: z.infer<typeof userCheckSchema>) => Promise<{ status: HttpStatus; message: string }>;
    search: ({ initiatorId, query, page, limit }: UserSearchParams) => Promise<Array<Pick<IUser, '_id' | 'name' | 'login'>>>;
    findById: (id: Types.ObjectId | string) => Promise<IUser | null>;
    create: (dto: Omit<SignupDTO, 'otp'>) => Promise<UserWithoutPassword>;
    exists: (filter: FilterQuery<User>) => Promise<{ _id: Types.ObjectId }>;
    findOneByPayload: (payload: FilterQuery<User>, projection?: ProjectionType<User>, options?: QueryOptions<User>) => Promise<IUser | null>;
    findManyByPayload: (payload: FilterQuery<User>, projection?: ProjectionType<User>, options?: QueryOptions<User>) => Promise<Array<IUser>>;
}