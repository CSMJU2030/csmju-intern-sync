import { Module } from '@nestjs/common';
import { AccessTokenVerifier } from './auth/access-token-verifier.service';
import { AuthController, MeController } from './auth/auth.controller';
import { HealthController } from './health.controller';
import { PrismaService } from './prisma/prisma.service';

@Module({
  controllers: [HealthController, AuthController, MeController],
  providers: [PrismaService, AccessTokenVerifier],
})
export class AppModule {}