import { Controller, Get } from '@nestjs/common';
import { DNSHealthIndicator, HealthCheckService } from '@nestjs/terminus';

@Controller('leaderboard')
export class LeaderboardController {
  constructor() {}

  @Get()
  healthCheck() {}
}
