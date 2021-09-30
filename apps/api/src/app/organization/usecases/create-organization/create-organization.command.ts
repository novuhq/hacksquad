import { IsDefined, IsHexColor, IsOptional, IsString, IsUrl, Length } from 'class-validator';
import { Field } from '@nestjs/graphql';
import { AuthenticatedCommand } from '../../../shared/commands/authenticated.command';
import { CommandHelper } from '../../../shared/commands/command.helper';

export class CreateOrganizationCommand extends AuthenticatedCommand {
  static create(data: CreateOrganizationCommand) {
    return CommandHelper.create(CreateOrganizationCommand, data);
  }

  @IsDefined()
  @IsString()
  public readonly name: string;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  @Length(3, 40)
  public readonly tagline: string;

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
