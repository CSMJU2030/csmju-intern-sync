import { Controller, Get, Version, VERSION_NEUTRAL } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Version(VERSION_NEUTRAL)
  @Get()
  check() {
    return {
      success: true,
      data: { status: 'ok' },
      meta: {}
    };
  }
}