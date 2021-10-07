import { AuthenticatedCommand } from '../../../shared/commands/authenticated.command';
import { CommandHelper } from '../../../shared/commands/command.helper';

export class GetOrganizationMembersCommand {
  static create(data: GetOrganizationMembersCommand) {
    return CommandHelper.create(GetOrganizationMembersCommand, data);
  }

  public readonly id: string;
}
