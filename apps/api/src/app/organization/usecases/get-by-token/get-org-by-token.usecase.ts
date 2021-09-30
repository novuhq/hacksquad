import { BadRequestException, Injectable } from '@nestjs/common';
import { OrganizationRepository } from '@hacksquad/core';
import { notifire } from '../../../shared/notifications';

@Injectable()
export class GetOrgByTokenUsecase {
  constructor(private organizationRepository: OrganizationRepository) {}
  async execute(command: { token: string }) {
    const organization = await this.organizationRepository.findById(command.token);

    if (!organization) {
      throw new BadRequestException('Organization not found');
    }

    (organization as any).acceptsJoins = organization.members?.length < 5;

    return organization;
  }
}
