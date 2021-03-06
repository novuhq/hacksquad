import { CreateOrganization } from './create-organization/create-organization.usecase';
import { GetOrganization } from './get-organization/get-organization.usecase';
import { GetMyOrganization } from './get-my-organization/get-my-organization.usecase';
import { AddMember } from './membership/add-member/add-member.usecase';
import { GetMembers } from './membership/get-members/get-members.usecase';
import { RemoveMember } from './membership/remove-member/remove-member.usecase';
import { OrganizationInvite } from './organization-invite/organization-invite.usecase';
import { GetOrgByTokenUsecase } from './get-by-token/get-org-by-token.usecase';

export const USE_CASES = [
  AddMember,
  CreateOrganization,
  GetOrganization,
  GetMyOrganization,
  GetMembers,
  RemoveMember,
  OrganizationInvite,
  GetOrgByTokenUsecase,
];
