import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  UserEntity,
  UserRepository,
  AnalyticsService,
  QueueService,
  MemberEntity,
  OrganizationRepository,
  OrganizationEntity,
} from '@hacksquad/core';
import { AuthProviderEnum, IJwtPayload } from '@hacksquad/shared';

import { CreateUserCommand } from '../../user/usecases/create-user/create-user.dto';
import { CreateUser } from '../../user/usecases/create-user/create-user.usecase';
import { AcceptInviteUsecase } from '../../shared/usecases/accept-invite/accept-invite.usecase';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private createUserUsecase: CreateUser,
    private jwtService: JwtService,
    private queueService: QueueService,
    private analyticsService: AnalyticsService,
    private organizationRepository: OrganizationRepository,
    private acceptInvite: AcceptInviteUsecase
  ) {}

  async authenticate(
    authProvider: AuthProviderEnum,
    accessToken: string,
    refreshToken: string,
    profile: { name: string; login: string; email: string; avatar_url: string; id: string },
    token: string
  ) {
    let user = await this.userRepository.findByLoginProvider(profile.id, authProvider);
    let newUser = false;

    if (!user) {
      user = await this.createUserUsecase.execute(
        CreateUserCommand.create({
          picture: profile.avatar_url,
          email: profile.email,
          lastName: profile.name ? profile.name.split(' ').slice(-1).join(' ') : null,
          firstName: profile.name ? profile.name.split(' ').slice(0, -1).join(' ') : profile.login,
          username: profile.login,
          profile,
          auth: {
            profileId: profile.id,
            provider: authProvider,
            accessToken,
            refreshToken,
          },
        })
      );
      newUser = true;

      this.analyticsService.upsertUser(user, user._id);
    } else {
      this.analyticsService.track('[Authentication] - Login', user._id, {
        loginType: authProvider,
      });
    }

    if (token) {
      const organizations = await this.organizationRepository.findUserActiveOrganizations(user._id);

      if (!organizations?.length) {
        try {
          await this.acceptInvite.execute({
            userId: user._id,
            organizationId: token,
          });
        } catch (e) {
          console.error(e);
        }
      }
    }

    let organization: OrganizationEntity;
    const organizations = await this.organizationRepository.findUserActiveOrganizations(user._id);
    if (organizations?.length) {
      [organization] = organizations;
    }

    return {
      newUser,
      token: await this.getSignedToken(user, organization?._id),
    };
  }

  async refreshToken(userId: string) {
    const user = await this.userRepository.findById(userId);

    const userOrganizations = await this.organizationRepository.findUserActiveOrganizations(user._id);

    let organizationId: string;
    let member: MemberEntity;
    if (userOrganizations?.length) {
      organizationId = userOrganizations[0]._id;
      member = await this.organizationRepository.findMemberByUserId(organizationId, userId);
    }

    return this.getSignedToken(user, organizationId, member);
  }

  async isAuthenticatedForOrganization(userId: string, organizationId: string): Promise<boolean> {
    return !!(await this.organizationRepository.isMemberOfOrganization(organizationId, userId));
  }

  async getSignedToken(user: UserEntity, organizationId?: string, member?: MemberEntity): Promise<string> {
    return this.jwtService.sign(
      {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profilePicture: user.profilePicture,
        organizationId: organizationId || null,
        roles: member && member.roles,
      },
      {
        expiresIn: '60 days',
        issuer: 'starter_api',
      }
    );
  }

  async validateUser(payload: IJwtPayload): Promise<UserEntity> {
    const user = await this.userRepository.findById(payload._id);
    return user;
  }
}
