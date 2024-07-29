import { Body, Controller, Post } from '@nestjs/common';
import { Routes } from 'src/utils/types';
import { OtpCreateDTO } from './dtos/otp.create.dto';
import { OtpService } from './otp.service';
import { IOtpController } from './types';

@Controller(Routes.OTP)
export class OtpController implements IOtpController {
    constructor(private readonly otpService: OtpService) {}

    @Post()
    create(@Body() { email, type }: OtpCreateDTO) {
        return this.otpService.create({ email, type });
    }
}