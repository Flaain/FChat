import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';

@Module({
    imports: [
        AuthModule,
        UserModule,
        ConfigModule.forRoot(),
        MongooseModule.forRoot(process.env.DATABASE_URI, { retryWrites: true }),
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}