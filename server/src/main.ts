import mongoose from 'mongoose';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

(async () => {
  try {
    const app = await NestFactory.create(AppModule);
  
    await app.listen(3000, () => console.log('Server started on port 3000'));
    await mongoose.connect(`mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@cluster0.olz1fld.mongodb.net/FChat?retryWrites=true&w=majority`);
  } catch (error) {
    console.log(error);
  }
})()
