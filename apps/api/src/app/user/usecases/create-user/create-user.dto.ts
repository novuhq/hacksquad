import { AuthProviderEnum } from '@hacksquad/shared';
import { CommandHelper } from '../../../shared/commands/command.helper';

export class CreateUserCommand {
  static create(data: CreateUserCommand) {
    return CommandHelper.create(CreateUserCommand, data);
  }

  email: string;

  firstName: string;

  lastName: string;

  picture?: string;

  username: string;

  profile: any;

  auth: {
    profileId: string;
    provider: AuthProviderEnum;
    accessToken: string;
    refreshToken: string;
  };
}
