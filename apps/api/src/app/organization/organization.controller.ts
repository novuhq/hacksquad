import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { OrganizationEntity } from '@hacksquad/core';
import { IJwtPayload, IOrganizationEntity, MemberRoleEnum } from '@hacksquad/shared';
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
import { GetOrgByTokenUsecase } from './usecases/get-by-token/get-org-by-token.usecase';

@Controller('/organizations')
@UseInterceptors(ClassSerializerInterceptor)
export class OrganizationController {
  constructor(
    private createOrganizationUsecase: CreateOrganization,
    private getMyOrganizationUsecase: GetMyOrganization,
    private getMembers: GetMembers,
    private removeMemberUsecase: RemoveMember,
    private organizationInviteUsecase: OrganizationInvite,
    private getOrganizationByToken: GetOrgByTokenUsecase
  ) {}

  @Post('/')
  @UseGuards(AuthGuard('jwt'))
  async createOrganization(
    @UserSession() user: IJwtPayload,
    @Body() body: CreateOrganizationDto
  ): Promise<OrganizationEntity> {
    const command = CreateOrganizationCommand.create({
      userId: user._id,
      name: body.name,
      tagline: body.tagline,
      company: body.company,
      color: body.color,
      logo: body.logo,
      promotionalsEnabled: body.promotionalsEnabled,
      termsAndConditions: body.termsAndConditions,
    });
    const organization = await this.createOrganizationUsecase.execute(command);

    return organization;
  }

  @Delete('/members/:memberId')
  @UseGuards(AuthGuard('jwt'))
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
  @UseGuards(AuthGuard('jwt'))
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
  @UseGuards(AuthGuard('jwt'))
  async getMyOrganization(@UserSession() user: IJwtPayload): Promise<IGetMyOrganizationDto> {
    const command = GetMyOrganizationCommand.create({
      userId: user._id,
      id: user.organizationId,
    });

    return await this.getMyOrganizationUsecase.execute(command);
  }

  @Post('/invite')
  @UseGuards(AuthGuard('jwt'))
  async inviteToOrganization(@Body('emails') emails: string[], @UserSession() session: IJwtPayload) {
    return await this.organizationInviteUsecase.execute({
      emails,
      organizationId: session.organizationId,
      inviterName: session.firstName,
    });
  }

  @Get('/token/:token')
  async getOrgByToken(@UserSession() user: IJwtPayload, @Param('token') token: string): Promise<OrganizationEntity> {
    return await this.getOrganizationByToken.execute({
      token,
    });
  }
}
