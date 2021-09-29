import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { OrganizationRepository } from '@hacksquad/core';
import { MemberRoleEnum, MemberStatusEnum } from '@hacksquad/shared';
import { ApiException } from '../../exceptions/api.exception';

@Injectable()
export class AcceptInviteUsecase {
  constructor(private organizationRepository: OrganizationRepository) {}
  async execute(command: { organizationId: string; userId: string }) {
    const organization = await this.organizationRepository.findById(command.organizationId);
    if (!organization) {
      throw new NotFoundException('Token invalid');
    }

    const members = await this.organizationRepository.getOrganizationMembers(organization._id);
    if (members.length >= 5) {
      throw new BadRequestException('Squad is full');
    }

    await this.addMember(command.userId, command.organizationId);

    return {
      success: true,
    };
  }

  async addMember(userId: string, organizationId: string): Promise<void> {
    const isAlreadyMember = await this.isMember(userId, organizationId);
    if (isAlreadyMember) throw new ApiException('Member already exists');

    await this.organizationRepository.addMember(organizationId, {
      _userId: userId,
      roles: [MemberRoleEnum.MEMBER],
      memberStatus: MemberStatusEnum.ACTIVE,
    });
  }

  private async isMember(userId: string, organizationId: string): Promise<boolean> {
    return !!(await this.organizationRepository.findMemberByUserId(organizationId, userId));
  }
}
