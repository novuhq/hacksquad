import { BaseRepository } from '../base-repository';
import { ContributionEntity } from './contribution.entity';
import { Contribution } from './contribution.schema';

export class ContributionRepository extends BaseRepository<ContributionEntity> {
  constructor() {
    super(Contribution, ContributionEntity);
  }
}
