import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,}));
  // Habilitar CORS si planeas conectar con un frontend
  app.enableCors();
  await app.listen(process.env.PORT || 3000);
  console.log(`Aplicación corriendo en: ${await app.getUrl()}`);
}
bootstrap();