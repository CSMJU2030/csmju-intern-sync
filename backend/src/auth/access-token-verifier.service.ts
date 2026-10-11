import { Injectable } from '@nestjs/common';
import { createRemoteJWKSet, jwtVerify, type JWTPayload } from 'jose';

@Injectable()
export class AccessTokenVerifier {
  private readonly jwks = createRemoteJWKSet(
    new URL(requiredEnv('CORE_HUB_JWKS_URL')),
    { cacheMaxAge: 600_000, cooldownDuration: 30_000, timeoutDuration: 5_000 },
  );

  async verify(token: string): Promise<JWTPayload> {
    const { payload, protectedHeader } = await jwtVerify(token, this.jwks, {
      algorithms: ['RS256'],
      issuer: process.env.CORE_HUB_ISSUER ?? 'core-hub',
      audience: process.env.CORE_HUB_AUDIENCE ?? 'csmju2030',
      clockTolerance: 60,
    });

    if (protectedHeader.alg !== 'RS256' || !protectedHeader.kid) {
      throw new Error('Invalid token header');
    }
    if (typeof payload.sub !== 'string' || payload.sub.length === 0) {
      throw new Error('Invalid subject');
    }
    if (typeof payload.iat !== 'number' || typeof payload.exp !== 'number') {
      throw new Error('Missing token timestamps');
    }
    if (payload.exp - payload.iat > 960) {
      throw new Error('Token lifetime exceeds the access token limit');
    }

    const subsystemId = process.env.SUBSYSTEM_ID ?? 'csmju-intern-sync';
    if (payload.azp !== undefined && payload.azp !== subsystemId) {
      throw new Error('Token was issued for another subsystem');
    }

    return payload;
  }
}

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required`);
  return value;
}