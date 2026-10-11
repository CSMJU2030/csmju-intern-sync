import 'reflect-metadata';
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { RequestMethod, VersioningType } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api', {
    exclude: [
      { path: 'auth/login', method: RequestMethod.GET },
      { path: 'auth/callback', method: RequestMethod.GET },
      { path: 'auth/logout', method: RequestMethod.POST },
    ],
  });
  app.enableVersioning({ type: VersioningType.URI });
  await app.listen(Number(process.env.PORT) || 4200);
}
bootstrap();