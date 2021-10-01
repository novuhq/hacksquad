import { IsHexColor, IsOptional, IsString, Length } from 'class-validator';
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
  @Length(3, 40)
  tagline: string;

  @IsString()
  @IsOptional()
  @Field({ nullable: true })
  company?: string;

  @IsOptional()
  @IsHexColor()
  color?: string;

  @IsOptional()
  logo?: string;

  promotionalsEnabled?: boolean;

  termsAndConditions?: boolean;

  companyLogo?: string;
}
