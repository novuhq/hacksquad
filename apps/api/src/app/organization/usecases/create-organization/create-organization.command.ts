import { IsDefined, IsHexColor, IsOptional, IsString, IsUrl } from 'class-validator';
import { AuthenticatedCommand } from '../../../shared/commands/authenticated.command';
import { CommandHelper } from '../../../shared/commands/command.helper';

export class CreateOrganizationCommand extends AuthenticatedCommand {
  static create(data: CreateOrganizationCommand) {
    return CommandHelper.create(CreateOrganizationCommand, data);
  }

  @IsDefined()
  @IsString()
  public readonly name: string;

  public readonly company: string;

  @IsOptional()
  @IsHexColor()
  public readonly color: string;

  @IsOptional()
  @IsUrl()
  public readonly logo: string;

  promotionalsEnabled?: boolean;

  termsAndConditions?: boolean;
}
