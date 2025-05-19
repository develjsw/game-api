import { Body, Controller, Patch, Post, Headers } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { ChangeUserRoleDto } from '../dto/change-user-role.dto';

@Controller('auth/users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    // 유저 등록
    @Post()
    async registerUser(@Body() dto: CreateUserDto): Promise<void> {
        await this.userService.registerUser(dto);
    }

    // 유저 역할 변경 (권한 변경)
    @Patch('role')
    async changeUserRole(@Headers('x-user-id') userId: string, @Body() dto: ChangeUserRoleDto): Promise<void> {
        await this.userService.changeUserRole(userId, dto);
    }
}
