import { BaseRepository } from '../base-repository';
import { ContributionEntity } from './contribution.entity';
import { Contribution } from './contribution.schema';

export class ContributionRepository extends BaseRepository<ContributionEntity> {
  constructor() {
    super(Contribution, ContributionEntity);
  }

  async getLeaderboard() {
    return await this._model.aggregate([
      {
        $match: {
          status: {
            $in: ['merged', 'accepted'],
          },
        },
      },
      {
        $group: {
          _id: '$_organizationId',
          commits: {
            $sum: 1,
          },
          linesAdded: {
            $sum: '$additions',
          },
          linesRemoved: {
            $sum: '$deletions',
          },
          files: {
            $sum: '$files',
          },
        },
      },
      {
        $sort: {
          commits: -1,
        },
      },
    ]);
  }

  async getOrganizationContributions(organizationId: string): Promise<ContributionEntity[]> {
    const contributions = await Contribution.find({
      _organizationId: organizationId,
      status: {
        $in: ['merged', 'accepted'],
      },
    }).sort({ _id: -1 });

    return this.mapEntities(contributions);
  }
}
