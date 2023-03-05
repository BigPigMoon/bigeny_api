import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder } from '@nestjs/swagger';
import { SwaggerModule } from '@nestjs/swagger/dist';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api-bigeny');

  app.enableCors({
    credentials: false,
    origin: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Begeny Docs')
    .setDescription('')
    .setVersion('1.0.0')
    .addTag('bigeny')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    deepScanRoutes: true,
  });
  SwaggerModule.setup('api-bigeny/docs', app, document);

  await app.listen(3333);
}

bootstrap();
