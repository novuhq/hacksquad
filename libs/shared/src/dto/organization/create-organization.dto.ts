export interface ICreateOrganizationDto {
  name: string;
  tagline?: string;
  logo?: string;
  taxIdentifier?: string;
}

export interface IOrganizationDTO {
  _id: string;
  name: string;
  tagline?: string;
  createdAt: Date;
  updatedAt: Date;
}
