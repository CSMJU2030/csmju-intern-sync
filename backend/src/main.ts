import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { Module, VersioningType } from '@nestjs/common';
import { HealthController } from './health.controller';
import { PrismaService } from './prisma/prisma.service';

@Module({
  controllers: [HealthController],
  providers: [PrismaService],
})
export class AppModule {}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI });
  await app.listen(Number(process.env.PORT) || 4200);
}
bootstrap();