import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { IJwtPayload } from '@hacksquad/shared';
import { UserRepository } from '@hacksquad/core';
import { GqlAuthGuard } from '../auth/framework/gql-auth.guard';
import { Member } from './member.graph';
import { UserSession } from '../shared/framework/user.decorator';
import { User } from '../user/user.graph';

@Resolver((of) => Member)
@UseGuards(GqlAuthGuard)
export class MemberResolver {
  constructor(private userRepository: UserRepository) {}

  @ResolveField((returns) => User)
  async user(@Parent() member: Member, @UserSession() user: IJwtPayload) {
    return await this.userRepository.findById(member._userId);
  }
}
