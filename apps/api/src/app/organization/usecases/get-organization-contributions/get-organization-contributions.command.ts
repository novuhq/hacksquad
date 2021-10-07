import { AuthenticatedCommand } from '../../../shared/commands/authenticated.command';
import { CommandHelper } from '../../../shared/commands/command.helper';

export class GetOrganizationContributionsCommand {
  static create(data: GetOrganizationContributionsCommand) {
    return CommandHelper.create(GetOrganizationContributionsCommand, data);
  }

  public readonly id: string;
}
