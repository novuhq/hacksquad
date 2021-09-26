import { IsEnum, IsIn, IsString } from 'class-validator';
import { CommandHelper } from '../../../shared/commands/command.helper';

export class GetSignedUrlCommand {
  static create(data: GetSignedUrlCommand) {
    return CommandHelper.create<GetSignedUrlCommand>(GetSignedUrlCommand, data);
  }

  @IsString()
  userId: string;

  @IsString()
  @IsIn(['jpg', 'png', 'jpeg'])
  extension: string;
}
