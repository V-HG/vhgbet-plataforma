import { Controller, Get } from '@nestjs/common';
import { SportsService } from './sports.service';

@Controller('sports')
export class SportsController {
  constructor(private readonly sportsService: SportsService) {}

  @Get('live')
  getLive() {
    return this.sportsService.getLiveMatches();
  }
}