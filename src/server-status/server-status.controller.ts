import { Controller, Get } from '@nestjs/common';
import { ServerStatusService } from './server-status.service';
import { RateLimit } from 'nestjs-rate-limiter';

@Controller('server-status')
export class ServerStatusController {
  constructor(private readonly serverStatusService: ServerStatusService) {}

  @RateLimit({
    keyPrefix: 'health-check',
    points: 10,
    duration: 60,
    errorMessage: 'Please wait checking the health of the app.',
  })
  @Get()
  checkServerStatus() {
    return {
      message: 'Server is running',
    };
  }
}
