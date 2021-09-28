import { BadRequestException, Injectable } from '@nestjs/common';
import { OrganizationRepository } from '@hacksquad/core';
import { notifire } from '../../../shared/notifications';

@Injectable()
export class OrganizationInvite {
  constructor(private organizationRepository: OrganizationRepository) {}
  async execute(command: { emails: string[]; organizationId: string }) {
    const organization = await this.organizationRepository.findById(command.organizationId);

    if (!organization) {
      throw new BadRequestException('Organization not found');
    }

    for (const email of command.emails) {
      await notifire.trigger('organization-invite', {
        $email: email,
        $user_id: email,
        squadName: organization?.name,
        squadId: organization?._id,
      });
    }
  }
}
