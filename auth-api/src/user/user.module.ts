import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import { UserController } from './controller/user.controller';
import { UserService } from './service/user.service';
import { UserRepository } from './repository/user.repository';
import { USER_REPOSITORY_INTERFACE } from './interface/user-repository.interface';

@Module({
    imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
    controllers: [UserController],
    providers: [
        UserService,
        {
            provide: USER_REPOSITORY_INTERFACE,
            useClass: UserRepository
        }
    ],
    exports: [USER_REPOSITORY_INTERFACE]
})
export class UserModule {}
