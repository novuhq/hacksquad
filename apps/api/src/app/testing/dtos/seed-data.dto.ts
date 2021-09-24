import { UserEntity } from '@hacksquad/core';

export class SeedDataBodyDto {}

export interface ISeedDataResponseDto {
  token: string;
  user: UserEntity;
}
