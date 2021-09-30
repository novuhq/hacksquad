import { Controller, Get } from '@nestjs/common';
import { ContributionRepository, OrganizationRepository } from '@hacksquad/core';
import { IJwtPayload } from '@hacksquad/shared';
import { UserSession } from '../shared/framework/user.decorator';

@Controller('leaderboard')
export class LeaderboardController {
  constructor(
    private contributionsRepository: ContributionRepository,
    private organizationRepository: OrganizationRepository
  ) {}

  @Get('')
  async getLeaderboard(@UserSession() user: IJwtPayload) {
    const leaderboard = await this.contributionsRepository.getLeaderboard();

    const organizationIds = leaderboard.map((i) => i._id);
    const organizations = await this.organizationRepository.getLeaderBoardOrganizations(organizationIds);

    const mappedStandings = leaderboard.map((lbItem, index) => {
      const found = organizations.find((i) => String(i._id) === String(lbItem._id));

      found.members = found.members.map((member) => {
        return member.user;
      }) as any;

      return {
        position: index + 1,
        ...lbItem,
        squad: found,
      };
    });

    const dbOrganizations = await this.organizationRepository._model.find({});
    for (const organization of dbOrganizations) {
      const found = mappedStandings.find((i) => i.squad._id === String(organization._id));

      organization.members = [];
      if (!found) {
        mappedStandings.push({
          position: mappedStandings.length + 1,
          squad: organization,
          commits: 0,
          linesAdded: 0,
          linesRemoved: 0,
          files: 0,
        });
      }
    }

    let userTeam;
    if (user && user.organizationId) {
      userTeam = mappedStandings.find((i) => String(i._id) === user.organizationId);
    }

    return {
      leaderboard: mappedStandings.slice(0, 10),
      userTeam,
    };
  }
}
