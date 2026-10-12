import { Controller, Get, Version, VERSION_NEUTRAL } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Version(VERSION_NEUTRAL)
  @Get()
  check() {
    return {
      status: 'ok',
      service: 'csmju-intern-sync',
    };
  }
}