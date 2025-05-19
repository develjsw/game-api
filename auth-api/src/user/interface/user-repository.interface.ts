import { User, UserDocument } from '../schema/user.schema';

export const USER_REPOSITORY_INTERFACE = 'UserRepositoryInterface';

export interface UserRepositoryInterface {
    createUser(data: Partial<User>): Promise<UserDocument>;
    updateUserById(id: string, data: Partial<User>): Promise<void>;

    existsUserByConditions(data: Partial<User>): Promise<boolean>;

    findUserByConditions(data: Partial<User>): Promise<UserDocument | null>;
    findUserWithPasswordByConditions(data: Partial<User>): Promise<UserDocument | null>; // 비밀번호를 포함한 데이터 조회용
    findUserById(id: string): Promise<UserDocument | null>;
}
