import { Module } from '@nestjs/common';
import { VerificationController } from './verification.controller';
import { VerificationService } from './verification.service';
import { MongooseModule } from '@nestjs/mongoose';
import { VerificationCode, VerificationCodeSchema } from './schemas/verification.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: VerificationCode.name, schema: VerificationCodeSchema }])],
    controllers: [VerificationController],
    providers: [VerificationService],
    exports: [VerificationService],
})
export class VerificationModule {}