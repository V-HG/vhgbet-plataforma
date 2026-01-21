import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. ATIVAR O CORS (Permite o Frontend conversar com o Backend)
  app.enableCors(); 

  // 2. ATIVAR VALIDAÇÃO (Para checar senha e CPF)
  app.useGlobalPipes(new ValidationPipe());

  // Troque a linha final app.listen(3000) por:
  await app.listen(process.env.PORT || 3000);
}
bootstrap();