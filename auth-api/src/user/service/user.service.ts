import { BadRequestException, ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserDocument } from '../schema/user.schema';
import { CreateUserDto } from '../dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { USER_REPOSITORY_INTERFACE, UserRepositoryInterface } from '../interface/user-repository.interface';
import { ChangeUserRoleDto } from '../dto/change-user-role.dto';
import { UserRoleEnum } from '../../common/role/enum/user-role.enum';
import { ChangeUserRolePolicy } from '../../common/role/service/change-user-role.policy';

@Injectable()
export class UserService {
    constructor(
        @Inject(USER_REPOSITORY_INTERFACE)
        private readonly userRepository: UserRepositoryInterface,

        private readonly changeUserRolePolicy: ChangeUserRolePolicy
    ) {}

    // 유저 등록에서 역할은 기본 USER로 설정
    async registerUser(dto: CreateUserDto): Promise<void> {
        const { email, password } = dto;

        const existsEmail: boolean = await this.userRepository.existsUserByConditions({ email });
        if (existsEmail) {
            throw new BadRequestException('이미 존재하는 이메일입니다.');
        }

        const hashedPassword: string = await bcrypt.hash(password, 10);

        await this.userRepository.createUser({
            ...dto,
            password: hashedPassword,
            role: UserRoleEnum.USER
        });
    }

    async changeUserRole(id: string, dto: ChangeUserRoleDto): Promise<void> {
        const { role, code } = dto;

        const user: UserDocument | null = await this.userRepository.findUserById(id);
        if (!user) throw new NotFoundException('유저를 찾을 수 없습니다.');

        if (user.role === role) {
            throw new BadRequestException(`이미 ${role} 권한입니다.`);
        }

        const savedCode: string = this.changeUserRolePolicy.getCodeByRole(role);

        if (savedCode !== code) {
            throw new ForbiddenException('잘못된 코드이거나 역할을 변경할 수 없습니다.');
        }

        await this.userRepository.updateUserById(id, { role });
    }
}
