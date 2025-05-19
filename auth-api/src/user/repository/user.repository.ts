import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../schema/user.schema';
import { isValidObjectId, Model } from 'mongoose';
import { UserRepositoryInterface } from '../interface/user-repository.interface';

@Injectable()
export class UserRepository implements UserRepositoryInterface {
    constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

    async createUser(data: Partial<User>): Promise<UserDocument> {
        return await this.userModel.create(data);
    }

    async existsUserByConditions(data: Partial<User>): Promise<boolean> {
        const { password, email, role } = data;
        const where = {
            ...(password && { password }),
            ...(email && { email }),
            ...(role && { role })
        };

        if (!Object.keys(where).length) {
            return false;
        }

        return !!(await this.userModel.exists(where));
    }

    async findUserByConditions(data: Partial<User>): Promise<UserDocument | null> {
        const { password, email, role } = data;
        const where = {
            ...(password && { password }),
            ...(email && { email }),
            ...(role && { role })
        };

        if (!Object.keys(where).length) {
            return null;
        }

        return await this.userModel.findOne(where).exec();
    }

    async findUserWithPasswordByConditions(data: Partial<User>): Promise<UserDocument | null> {
        const { password, email, role } = data;
        const where = {
            ...(password && { password }),
            ...(email && { email }),
            ...(role && { role })
        };

        if (!Object.keys(where).length) {
            return null;
        }

        return await this.userModel.findOne(where).select('+password').exec();
    }

    async findUserById(id: string): Promise<UserDocument | null> {
        if (!isValidObjectId(id)) {
            throw new BadRequestException('유효하지 않은 userId 값 입니다.');
        }

        return this.userModel.findById(id).exec();
    }

    async updateUserById(id: string, data: Partial<User>): Promise<void> {
        await this.userModel.updateOne({ _id: id }, { $set: data });
    }
}
