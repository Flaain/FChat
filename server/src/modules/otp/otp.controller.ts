import { Body, Controller, Post } from '@nestjs/common';
import { Routes } from 'src/utils/types';
import { OtpCreateDTO } from './dtos/otp.create.dto';
import { OtpService } from './otp.service';

@Controller(Routes.OTP)
export class OtpController {
    constructor(private readonly otpService: OtpService) {}

    @Post()
    createOTP(@Body() { email, type }: OtpCreateDTO) {
        return this.otpService.create({ email, type });
    }
}