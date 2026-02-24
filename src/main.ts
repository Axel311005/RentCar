import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('RentCar API')
    .setDescription(
      'Documentación de la API para usuarios, clientes, categorías, vehículos, reservas y pagos.',
    )
    .setVersion('1.0.0')
    .addTag('Users')
    .addTag('Clientes')
    .addTag('Categorias')
    .addTag('Vehiculos')
    .addTag('Reservas')
    .addTag('Pagos')
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, swaggerDocument, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
      docExpansion: 'none',
    },
  });

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
