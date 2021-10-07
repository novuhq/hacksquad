import { Injectable, Scope } from '@nestjs/common';
import { ContributionRepository, OrganizationRepository } from '@hacksquad/core';
import { GetOrganizationMembersCommand } from './get-organization-members.command';

@Injectable({
  scope: Scope.REQUEST,
})
export class GetOrganizationMembers {
  constructor(private readonly organizationRepository: OrganizationRepository) {}

  async execute(command: GetOrganizationMembersCommand) {
    const members = await this.organizationRepository.getOrganizationMembers(command.id, true);

    return members;
  }
}
