import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Habilitar CORS para el frontend de Vite (localhost:5173)
  app.enableCors({
    origin: ['http://localhost:5173'],
    credentials: true,
  });

  // ✅ Validaciones globales de NestJS
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // ✅ Iniciar servidor
  await app.listen(process.env.PORT || 3000);
  console.log(`🚀 API corriendo en: http://localhost:3000`);
}
bootstrap();
