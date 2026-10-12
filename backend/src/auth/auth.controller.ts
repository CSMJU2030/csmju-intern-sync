import {
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { randomBytes, timingSafeEqual } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import type { JWTPayload } from 'jose';
import { resolve } from 'node:path';
import { AccessTokenVerifier } from './access-token-verifier.service';

const STATE_MAX_AGE_MS = 600_000;
const SESSION_COOKIE_MAX_AGE_MS = 900_000;

@Controller({ path: 'auth', version: VERSION_NEUTRAL })
@ApiTags('Auth')
export class AuthController {
  private readonly subsystemId = process.env.SUBSYSTEM_ID ?? 'csmju-intern-sync';
  private readonly cookiePrefix = this.subsystemId.replace(/[^a-zA-Z0-9_]/g, '_');
  private readonly stateCookieName = `${this.cookiePrefix}_sso_state`;
  private readonly sessionCookieName = `${this.cookiePrefix}_access_token`;
  private readonly secureCookies = process.env.NODE_ENV === 'production';
  private readonly allowedRoles = new Set(
    (process.env.SUBSYSTEM_ALLOWED_ROLES ?? 'student,staff,lecturer')
      .split(',')
      .map((role) => role.trim())
      .filter(Boolean),
  );

  constructor(private readonly tokenVerifier: AccessTokenVerifier) {}

  @Get('login')
  @ApiQuery({ name: 'next', required: false, type: String, description: 'Local path to redirect to after sign-in' })
  @ApiResponse({ status: 302, description: 'Redirects to Core Hub SSO' })
  @ApiResponse({ status: 503, description: 'Authentication is unavailable' })
  login(
    @Query('next') nextQuery: string | undefined,
    @Res() response: Response,
  ): Response {
    setAuthHeaders(response);
    const next = safeNext(nextQuery);
    const state = randomBytes(32).toString('base64url');
    const stateValue = `${state}.${Buffer.from(next).toString('base64url')}`;
    response.cookie(this.stateCookieName, stateValue, {
      httpOnly: true,
      sameSite: 'lax',
      secure: this.secureCookies,
      path: '/auth/callback',
      maxAge: STATE_MAX_AGE_MS,
    });

    const coreHubWebUrl = process.env.CORE_HUB_WEB_URL ?? process.env.CORE_HUB_URL;
    if (!coreHubWebUrl) {
      return response.status(503).json({
        success: false,
        error: { code: 'SERVICE_UNAVAILABLE', message: 'Authentication is unavailable' },
        meta: {},
      });
    }
    const authorizeUrl = new URL('/sso/authorize', coreHubWebUrl);
    authorizeUrl.searchParams.set('subsystem', this.subsystemId);
    authorizeUrl.searchParams.set('state', state);
    response.redirect(302, authorizeUrl.toString());
    return response;
  }

  @Get('callback')
  @ApiQuery({ name: 'access_token', required: true, type: String })
  @ApiQuery({ name: 'state', required: false, type: String })
  @ApiResponse({ status: 302, description: 'Sets the verified session cookie and redirects to the local path' })
  @ApiResponse({ status: 400, description: 'Missing access token' })
  @ApiResponse({ status: 401, description: 'Invalid state or access token' })
  @ApiResponse({ status: 403, description: 'The account role is not allowed' })
  async callback(
    @Query('access_token') accessToken: string | undefined,
    @Query('state') returnedState: string | undefined,
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<Response> {
    setAuthHeaders(response);
    if (!accessToken) {
      return response.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Missing access token' },
        meta: {},
      });
    }

    if (!returnedState) {
      response.redirect(302, '/auth/login');
      return response;
    }

    response.clearCookie(this.stateCookieName, {
      httpOnly: true,
      sameSite: 'lax',
      secure: this.secureCookies,
      path: '/auth/callback',
    });
    const savedState = readCookie(request, this.stateCookieName);
    const separator = savedState?.indexOf('.') ?? -1;
    if (separator < 1 || !constantTimeEqual(savedState!.slice(0, separator), returnedState)) {
      return unauthorized(response, request);
    }

    let next = '/';
    try {
      const encodedNext = savedState!.slice(separator + 1);
      next = safeNext(Buffer.from(encodedNext, 'base64url').toString('utf8'));
    } catch {
      next = '/';
    }

    let payload: JWTPayload;
    try {
      payload = await this.tokenVerifier.verify(accessToken);
    } catch {
      return unauthorized(response, request);
    }

    if (typeof payload.role !== 'string' || !this.allowedRoles.has(payload.role)) {
      return response.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Your account cannot access this subsystem' },
        meta: {},
      });
    }

    const remainingSeconds = Math.min(payload.exp! - Math.floor(Date.now() / 1000), 900);
    if (remainingSeconds <= 0) return unauthorized(response, request);

    response.cookie(this.sessionCookieName, accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: this.secureCookies,
      path: '/',
      maxAge: remainingSeconds * 1000,
    });
    response.redirect(302, next);
    return response;
  }

  @Post('logout')
  @ApiResponse({ status: 303, description: 'Clears subsystem cookies and redirects to Core Hub logout' })
  @ApiResponse({ status: 503, description: 'Core Hub URL is unavailable' })
  logout(@Res() response: Response): Response {
    setAuthHeaders(response);
    response.clearCookie(this.sessionCookieName, {
      httpOnly: true,
      sameSite: 'lax',
      secure: this.secureCookies,
      path: '/',
    });
    response.clearCookie(this.stateCookieName, {
      httpOnly: true,
      sameSite: 'lax',
      secure: this.secureCookies,
      path: '/auth/callback',
    });
    const coreHubWebUrl = process.env.CORE_HUB_WEB_URL ?? process.env.CORE_HUB_URL;
    if (!coreHubWebUrl) return response.status(503).end();
    response.redirect(303, new URL('/logout', coreHubWebUrl).toString());
    return response;
  }
}

function safeNext(value: string | undefined): string {
  if (!value || value.length > 512 || !value.startsWith('/') || value.startsWith('//')) return '/';
  if (value.includes('\\') || /[\u0000-\u001f\u007f]/.test(value)) return '/';
  try {
    const url = new URL(value, 'https://subsystem.invalid');
    if (url.origin !== 'https://subsystem.invalid' || url.pathname === '/auth' || url.pathname.startsWith('/auth/')) {
      return '/';
    }
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return '/';
  }
}

function readCookie(request: Request, name: string): string | undefined {
  const cookieHeader = request.headers.cookie;
  if (!cookieHeader) return undefined;
  for (const pair of cookieHeader.split(';')) {
    const separator = pair.indexOf('=');
    if (separator < 0 || pair.slice(0, separator).trim() !== name) continue;
    try {
      return decodeURIComponent(pair.slice(separator + 1).trim());
    } catch {
      return undefined;
    }
  }
  return undefined;
}

function constantTimeEqual(left: string, right: string): boolean {
  const leftBytes = Buffer.from(left);
  const rightBytes = Buffer.from(right);
  return leftBytes.length === rightBytes.length && timingSafeEqual(leftBytes, rightBytes);
}

function setAuthHeaders(response: Response): void {
  response.setHeader('Cache-Control', 'no-store');
  response.setHeader('Referrer-Policy', 'no-referrer');
}

function unauthorized(response: Response, request: Request): Response {
  if (request.accepts('html')) {
    return response.status(401).type('html').send(
      '<!doctype html><html lang="en"><meta charset="utf-8"><title>Sign in required</title><p>Sign in again to continue.</p><a href="/auth/login">Sign in</a></html>',
    );
  }
  return response.status(401).json({
    success: false,
    error: { code: 'UNAUTHORIZED', message: 'Authentication is required' },
    meta: {},
  });
}

interface MockUserProfile {
  id: string;
  name: string;
  studentId: string | null;
}

interface MockUserDatabase {
  users: MockUserProfile[];
}

@Controller({ path: 'me', version: '1' })
@ApiTags('Auth')
export class MeController {
  private readonly sessionCookieName = `${(process.env.SUBSYSTEM_ID ?? 'csmju-intern-sync').replace(/[^a-zA-Z0-9_]/g, '_')}_access_token`;
  private readonly allowedRoles = new Set(
    (process.env.SUBSYSTEM_ALLOWED_ROLES ?? 'student,staff,lecturer')
      .split(',')
      .map((role) => role.trim())
      .filter(Boolean),
  );

  constructor(private readonly tokenVerifier: AccessTokenVerifier) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Returns the authenticated user profile',
    schema: {
      type: 'object',
      required: ['success', 'data'],
      properties: {
        success: { type: 'boolean', enum: [true] },
        data: {
          type: 'object',
          required: ['id', 'email', 'name', 'role', 'studentId'],
          properties: {
            id: { type: 'string', description: 'The user sub from the verified Core Hub token' },
            email: { type: 'string', nullable: true },
            name: { type: 'string', nullable: true },
            role: { type: 'string' },
            studentId: { type: 'string', nullable: true },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Authentication is required' })
  @ApiResponse({ status: 403, description: 'The account role is not allowed' })
  async me(
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<Response> {
    setAuthHeaders(response);
    const authorization = request.headers.authorization;
    const bearer = authorization === undefined
      ? undefined
      : /^Bearer ([^\s]+)$/i.exec(authorization)?.[1];
    const accessToken = authorization === undefined
      ? readCookie(request, this.sessionCookieName)
      : bearer;
    if (!accessToken) return unauthorizedJson(response);

    let payload: JWTPayload;
    try {
      payload = await this.tokenVerifier.verify(accessToken);
    } catch {
      return unauthorizedJson(response);
    }

    if (typeof payload.sub !== 'string' || payload.sub.length === 0) {
      return unauthorizedJson(response);
    }

    if (typeof payload.role !== 'string' || !this.allowedRoles.has(payload.role)) {
      return response.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Your account cannot access this subsystem' },
        meta: {},
      });
    }

    const profile = await findMockUserProfile(payload.sub);
    return response.status(200).json({
      success: true,
      data: {
        id: payload.sub,
        email: typeof payload.email === 'string' ? payload.email : null,
        name: profile?.name ?? null,
        role: payload.role,
        studentId: profile?.studentId ?? null,
      },
    });
  }
}

async function findMockUserProfile(id: string): Promise<MockUserProfile | undefined> {
  const contents = await readFile(resolve(process.cwd(), 'dumb-database.json'), 'utf8');
  const database: unknown = JSON.parse(contents);
  if (!isMockUserDatabase(database)) {
    throw new Error('Invalid dumb-database.json mock user data');
  }
  return database.users.find((user) => user.id === id);
}

function isMockUserDatabase(value: unknown): value is MockUserDatabase {
  if (typeof value !== 'object' || value === null || !('users' in value) || !Array.isArray(value.users)) {
    return false;
  }
  return value.users.every(
    (user: unknown) =>
      typeof user === 'object' &&
      user !== null &&
      'id' in user &&
      typeof user.id === 'string' &&
      'name' in user &&
      typeof user.name === 'string' &&
      'studentId' in user &&
      (typeof user.studentId === 'string' || user.studentId === null),
  );
}

function unauthorizedJson(response: Response): Response {
  return response.status(401).json({
    success: false,
    error: { code: 'UNAUTHORIZED', message: 'Authentication is required' },
    meta: {},
  });
}