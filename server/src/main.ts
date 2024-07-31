import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ZodValidationPipe } from 'nestjs-zod';
import { AllExceptionFilter } from './utils/filters/all.expection.filter';
import { CookiesService } from './utils/services/cookies/cookies.service';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Response } from 'express';
import { cookieParser } from './utils/middlewares/cookieParser';

(async () => {
    try {
        const app = await NestFactory.create<NestExpressApplication>(AppModule);
        const PORT = process.env.PORT ?? 3000;

        app.use(cookieParser); // <-- right now for my needs i can use my custom parser without lib
        
        app.useGlobalPipes(new ZodValidationPipe());
        app.useGlobalFilters(new AllExceptionFilter(app.get(HttpAdapterHost), app.get(CookiesService)));
        
        app.enableCors({ origin: process.env.CLIENT_URL, credentials: true });
        
        app.use('/health', (_, res: Response) => {
            res.json({ status: true });
        });

        await app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    } catch (error) {
        console.log(error);
    }
})();