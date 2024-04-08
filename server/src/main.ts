import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ZodValidationPipe } from 'nestjs-zod';

(async () => {
  try {
    const app = await NestFactory.create(AppModule);
    
    app.useGlobalPipes(new ZodValidationPipe())
    app.enableCors();

    await app.listen(3000, () => console.log('Server started on port 3000'));
  } catch (error) {
    console.log(error);
  }
})()