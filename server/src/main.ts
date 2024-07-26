import * as cookieParser from 'cookie-parser';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ZodValidationPipe } from 'nestjs-zod';
import { AllExceptionFilter } from './utils/filters/all.expection.filter';
import { CookiesService } from './utils/services/cookies/cookies.service';

(async () => {
    try {
        const app = await NestFactory.create(AppModule);
        const PORT = process.env.PORT ?? 3000;

        app.use(cookieParser());
        app.useGlobalPipes(new ZodValidationPipe());
        app.useGlobalFilters(new AllExceptionFilter(app.get(HttpAdapterHost), app.get(CookiesService)));
        app.enableCors({ origin: process.env.CLIENT_URL, credentials: true });

        await app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    } catch (error) {
        console.log(error);
    }
})();