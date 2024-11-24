import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('vending-api');
  app.enableCors();
  // const app = await NestFactory.create(AppModule);
  // Enable validation and transformation globally
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Enables class-transformer transformation
      whitelist: true, // Strips out properties not defined in DTO
      forbidNonWhitelisted: true, // Throws an error for invalid properties
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Vending Machine API')
    .setDescription('API for managing vending machine operations')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(process.env.PORT ?? 3080);
}
bootstrap();
