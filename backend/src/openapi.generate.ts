import 'reflect-metadata';
import 'dotenv/config';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { NestFactory } from '@nestjs/core';
import { RequestMethod, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

process.env.CORE_HUB_JWKS_URL ??= 'https://csmju2030.jowave.com/api/v1/.well-known/jwks.json';
process.env.DATABASE_URL ??= 'postgresql://localhost:5432/openapi_generation';

async function generateOpenApi(): Promise<void> {
  const app = await NestFactory.create(AppModule, { logger: false });
  app.setGlobalPrefix('api', {
    exclude: [
      { path: 'auth/login', method: RequestMethod.GET },
      { path: 'auth/callback', method: RequestMethod.GET },
      { path: 'auth/logout', method: RequestMethod.POST },
    ],
  });
  app.enableVersioning({ type: VersioningType.URI });
  const config = new DocumentBuilder()
    .setTitle('InternSync API')
    .setDescription('API contract for csmju-intern-sync')
    .setVersion('1.0.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  writeFileSync(resolve(process.cwd(), 'openapi.json'), `${JSON.stringify(document, null, 2)}\n`);
  await app.close();
}

void generateOpenApi();