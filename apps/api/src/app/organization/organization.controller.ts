import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { OrganizationEntity } from '@hacksquad/core';
import { IJwtPayload, MemberRoleEnum } from '@hacksquad/shared';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/framework/roles.decorator';
import { UserSession } from '../shared/framework/user.decorator';
import { CreateOrganizationDto } from './dtos/create-organization.dto';
import { CreateOrganizationCommand } from './usecases/create-organization/create-organization.command';
import { CreateOrganization } from './usecases/create-organization/create-organization.usecase';
import { GetMyOrganizationCommand } from './usecases/get-my-organization/get-my-organization.command';
import { GetMyOrganization } from './usecases/get-my-organization/get-my-organization.usecase';
import { GetMembersCommand } from './usecases/membership/get-members/get-members.command';
import { GetMembers } from './usecases/membership/get-members/get-members.usecase';
import { RemoveMember } from './usecases/membership/remove-member/remove-member.usecase';
import { RemoveMemberCommand } from './usecases/membership/remove-member/remove-member.command';
import { IGetMyOrganizationDto } from './dtos/get-my-organization.dto';
import { OrganizationInvite } from './usecases/organization-invite/organization-invite.usecase';
import { AcceptInviteUsecase } from './usecases/accept-invite/accept-invite.usecase';

@Controller('/organizations')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard('jwt'))
export class OrganizationController {
  constructor(
    private createOrganizationUsecase: CreateOrganization,
    private getMyOrganizationUsecase: GetMyOrganization,
    private getMembers: GetMembers,
    private removeMemberUsecase: RemoveMember,
    private organizationInviteUsecase: OrganizationInvite,
    private acceptInciteUsecase: AcceptInviteUsecase
  ) {}

  @Post('/')
  async createOrganization(
    @UserSession() user: IJwtPayload,
    @Body() body: CreateOrganizationDto
  ): Promise<OrganizationEntity> {
    const command = CreateOrganizationCommand.create({
      userId: user._id,
      name: body.name,
      company: body.company,
      color: body.color,
      logo: body.logo,
    });
    const organization = await this.createOrganizationUsecase.execute(command);

    return organization;
  }

  @Delete('/members/:memberId')
  @Roles(MemberRoleEnum.ADMIN)
  async removeMember(@UserSession() user: IJwtPayload, @Param('memberId') memberId: string) {
    return await this.removeMemberUsecase.execute(
      RemoveMemberCommand.create({
        userId: user._id,
        organizationId: user.organizationId,
        memberId,
      })
    );
  }

  @Get('/members')
  @Roles(MemberRoleEnum.ADMIN)
  async getMember(@UserSession() user: IJwtPayload) {
    return await this.getMembers.execute(
      GetMembersCommand.create({
        userId: user._id,
        organizationId: user.organizationId,
      })
    );
  }

  @Get('/me')
  async getMyOrganization(@UserSession() user: IJwtPayload): Promise<IGetMyOrganizationDto> {
    const command = GetMyOrganizationCommand.create({
      userId: user._id,
      id: user.organizationId,
    });

    return await this.getMyOrganizationUsecase.execute(command);
  }

  @Post('/invite')
  async inviteToOrganization(@Body('emails') emails: string[], @UserSession() session: IJwtPayload) {
    return await this.organizationInviteUsecase.execute({
      emails,
      organizationId: session.organizationId,
    });
  }

  @Post('/invite/accept')
  async acceptInvite(@Body('token') token: string, @UserSession() session: IJwtPayload) {
    return await this.acceptInciteUsecase.execute({
      organizationId: token,
      userId: session._id,
    });
  }
}
