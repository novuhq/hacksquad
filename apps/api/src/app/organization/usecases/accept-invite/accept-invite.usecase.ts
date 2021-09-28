import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { OrganizationRepository } from '@hacksquad/core';
import { MemberRoleEnum } from '@hacksquad/shared';
import { AddMember } from '../membership/add-member/add-member.usecase';
import { AddMemberCommand } from '../membership/add-member/add-member.command';

@Injectable()
export class AcceptInviteUsecase {
  constructor(private organizationRepository: OrganizationRepository, private addMemberUsecase: AddMember) {}
  async execute(command: { organizationId: string; userId: string }) {
    const organization = await this.organizationRepository.findById(command.organizationId);
    if (!organization) {
      throw new NotFoundException('Token invalid');
    }

    const members = await this.organizationRepository.getOrganizationMembers(organization._id);
    if (members.length >= 5) {
      throw new BadRequestException('Squad is full');
    }

    await this.addMemberUsecase.execute(
      AddMemberCommand.create({
        organizationId: organization._id,
        roles: [MemberRoleEnum.MEMBER],
        userId: command.userId,
      })
    );

    return {
      success: true,
    };
  }
}
