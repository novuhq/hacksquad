import { Injectable, Scope } from '@nestjs/common';
import { ContributionRepository, OrganizationRepository } from '@hacksquad/core';
import { GetOrganizationContributionsCommand } from './get-organization-contributions.command';

@Injectable({
  scope: Scope.REQUEST,
})
export class GetOrganizationContributions {
  constructor(
    private readonly organizationRepository: OrganizationRepository,
    private readonly contributionRepository: ContributionRepository
  ) {}

  async execute(command: GetOrganizationContributionsCommand) {
    const contributions = await this.contributionRepository.getOrganizationContributions(command.id);

    return contributions;
  }
}
