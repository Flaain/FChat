import { HttpStatus, Injectable } from '@nestjs/common';
import { AppException } from 'src/utils/exceptions/app.exception';
import { emailExistError, userExistError } from './constants';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthUtils {
    constructor(private readonly userService: UserService) {}

    checkName = async (name: string) => {
        const candidate = await this.userService.exists({ name: { $regex: name, $options: 'i' } });

        if (candidate) throw new AppException(userExistError, HttpStatus.CONFLICT);

        return { status: HttpStatus.OK, message: 'OK' };
    };

    checkEmail = async (email: string) => {
        const candidate = await this.userService.exists({ email });

        if (candidate) throw new AppException(emailExistError, HttpStatus.CONFLICT);

        return { status: HttpStatus.OK, message: 'OK' };
    };
}