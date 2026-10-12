import { Controller, Get, Version, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@Controller('health')
@ApiTags('Health')
export class HealthController {
  @Version(VERSION_NEUTRAL)
  @Get()
  @ApiOkResponse({
    description: 'Health status of the service',
    schema: {
      type: 'object',
      required: ['status', 'service'],
      properties: {
        status: { type: 'string', enum: ['ok'] },
        service: { type: 'string', example: 'csmju-intern-sync' },
      },
    },
  })
  check() {
    return {
      status: 'ok',
      service: 'csmju-intern-sync',
    };
  }
}