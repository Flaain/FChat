import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ZodValidationPipe } from 'nestjs-zod';

(async () => {
  try {
    const app = await NestFactory.create(AppModule);
    const PORT = process.env.PORT ?? 3000;

    app.useGlobalPipes(new ZodValidationPipe())
    app.enableCors();

    await app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (error) {
    console.log(error);
  }
})()