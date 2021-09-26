import { Module } from '@nestjs/common';
import { SharedModule } from '../shared/shared.module';
import { LeaderboardController } from './leaderboard.controller';

@Module({
  imports: [SharedModule],
  controllers: [LeaderboardController],
  providers: [],
})
export class LeaderboardModule {}
