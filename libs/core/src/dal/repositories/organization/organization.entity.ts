import { IMemberInvite, MemberRoleEnum, MemberStatusEnum } from '@hacksquad/shared';
import { Exclude } from 'class-transformer';
import { UserEntity } from '../user';

export class MemberEntity {
  _id: string;
  _userId?: string;
  user?: Pick<UserEntity, 'firstName' | '_id' | 'lastName' | 'email'>;
  roles: MemberRoleEnum[];
  invite?: IMemberInvite;
  memberStatus: MemberStatusEnum;
}

export class OrganizationEntity {
  _id?: string;
  color: string;
  name: string;
  tagline: string;
  company?: string;
  logo: string;

  acceptsJoins?: boolean;

  @Exclude({ toPlainOnly: true })
  members?: MemberEntity[];
}
