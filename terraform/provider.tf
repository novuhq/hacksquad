
# Specify the provider and access details
provider "aws" {
  shared_credentials_file = "$HOME/.aws/credentials"
  profile                 = var.aws_profile
  region                  = var.aws_region
}

data "aws_ssm_parameter" "atlas_public_key" {
  name = "/GENERAL/MONGO_ATLAS_PUBLIC_KEY"
}

data "aws_ssm_parameter" "atlas_private_key" {
  name = "/GENERAL/MONGO_ATLAS_PRIVATE_KEY"
}

provider "mongodbatlas" {
  public_key = data.aws_ssm_parameter.atlas_public_key.value
  private_key = data.aws_ssm_parameter.atlas_private_key.value
}
