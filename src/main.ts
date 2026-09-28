import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Habilita la validación automática de los DTOs 
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Elimina propiedades no definidas en el DTO
    forbidNonWhitelisted: true, // Lanza error si envían propiedades extra 
    transform: true, // Convierte los tipos automáticamente 
  }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
