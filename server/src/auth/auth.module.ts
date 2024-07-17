import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from 'src/user/user.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { VerificationModule } from 'src/verification/verification.module';
import { SessionModule } from 'src/session/session.module';
import { JWT_KEYS } from 'src/utils/types';
import { BcryptModule } from 'src/utils/bcrypt/bcrypt.module';

@Module({
    imports: [
        UserModule,
        PassportModule,
        ConfigModule,
        BcryptModule,
        VerificationModule,
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