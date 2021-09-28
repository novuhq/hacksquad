import { Injectable, Logger, Scope } from '@nestjs/common';
import { OrganizationEntity, OrganizationRepository, QueueService, UserRepository } from '@hacksquad/core';
import { MemberRoleEnum } from '@hacksquad/shared';
import { GetOrganizationCommand } from '../get-organization/get-organization.command';
import { GetOrganization } from '../get-organization/get-organization.usecase';
import { AddMemberCommand } from '../membership/add-member/add-member.command';
import { AddMember } from '../membership/add-member/add-member.usecase';
import { CreateOrganizationCommand } from './create-organization.command';

@Injectable({
  scope: Scope.REQUEST,
})
export class CreateOrganization {
  constructor(
    private readonly organizationRepository: OrganizationRepository,
    private readonly addMemberUsecase: AddMember,
    private readonly getOrganizationUsecase: GetOrganization,
    private readonly queueService: QueueService,
    private readonly userRepository: UserRepository
  ) {}

  async execute(command: CreateOrganizationCommand): Promise<OrganizationEntity> {
    const organization = new OrganizationEntity();
    organization.company = command.company;
    organization.name = command.name;
    organization.color = command.color;
    organization.logo = command.logo;

    const user = await this.userRepository.findById(command.userId);

    const createdOrganization = await this.organizationRepository.create(organization);

    await this.addMemberUsecase.execute(
      AddMemberCommand.create({
        roles: [MemberRoleEnum.ADMIN],
        organizationId: createdOrganization._id,
        userId: command.userId,
      })
    );

    const organizationAfterChanges = await this.getOrganizationUsecase.execute(
      GetOrganizationCommand.create({
        id: createdOrganization._id,
        userId: command.userId,
      })
    );

    this.queueService.userProcessQueue.add(
      {
        userId: user._id,
      },
      {
        removeOnComplete: true,
      }
    );

    return organizationAfterChanges;
  }
}
