import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OTP, OTPSchema } from './schemas/otp.schema';
import { OTPController } from './otp.controller';
import { OTPService } from './otp.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: OTP.name, schema: OTPSchema }])],
    controllers: [OTPController],
    providers: [OTPService],
    exports: [OTPService],
})
export class OTPModule {}