import { BadRequestException, Injectable } from '@nestjs/common';
import { OrganizationRepository } from '@hacksquad/core';
import { notifire } from '../../../shared/notifications';

@Injectable()
export class OrganizationInvite {
  constructor(private organizationRepository: OrganizationRepository) {}
  async execute(command: { emails: string[]; organizationId: string; inviterName: string }) {
    const organization = await this.organizationRepository.findById(command.organizationId);

    if (!organization) {
      throw new BadRequestException('Organization not found');
    }

    for (const email of command.emails) {
      await notifire.trigger('organization-invite', {
        $email: email,
        $user_id: email,
        inviterName: command.inviterName,
        squadName: organization?.name,
        squadId: organization?._id,
        token: organization?._id,
        branding: {
          logo: 'https://uploads-ssl.webflow.com/6130b55cdc153dd345632ef1/6150edec1e11a6802fe4a951_hacksquad-color.png',
        },
      } as any);
    }
  }
}
