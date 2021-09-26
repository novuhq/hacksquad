import { IsOptional, IsString } from 'class-validator';
import { ICreateOrganizationDto } from '@hacksquad/shared';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateOrganizationDto implements ICreateOrganizationDto {
  @IsString()
  @Field()
  name: string;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  company?: string;
}
