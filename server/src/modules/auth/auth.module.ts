import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JWT_KEYS } from 'src/utils/types';
import { CookiesModule } from 'src/utils/services/cookies/cookies.module';
import { BcryptModule } from 'src/utils/services/bcrypt/bcrypt.module';
import { UserModule } from '../user/user.module';
import { OtpModule } from '../otp/otp.module';
import { SessionModule } from '../session/session.module';

@Module({
    imports: [
        UserModule,
        PassportModule,
        ConfigModule,
        CookiesModule,
        BcryptModule,
        OtpModule,
        SessionModule,
        PassportModule.register({ defaultStrategy: 'jwt', property: 'user' }),
        JwtModule.registerAsync({
            useFactory: (config: ConfigService) => {
                return {
                    secret: config.get<string>(JWT_KEYS.ACCESS_TOKEN_SECRET),
                    signOptions: {
                        expiresIn: config.get<string>(JWT_KEYS.ACCESS_TOKEN_EXPIRESIN),
                        audience: ['user'],
                    },
                };
            },
            imports: [ConfigModule],
            inject: [ConfigService],
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
})
export class AuthModule {}