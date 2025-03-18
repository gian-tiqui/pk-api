import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';

async function bootstrap() {
  const mainLogger: Logger = new Logger('WMC Patient Kiosk');
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT;

  app.enableCors({
    origin: ['http://localhost:5173', 'http://10.10.10.30:8080'],
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders:
      'Origin, Content-Type, Authorization, X-RequestedWith, Cache-Control',
    credentials: true,
  });

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app
    .listen(PORT, () => {
      mainLogger.log(`Server started at port ${PORT}`);
    })
    .catch((err) => {
      mainLogger.error(err);
    });
}
bootstrap();
