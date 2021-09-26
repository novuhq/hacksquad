terraform {
  backend "s3" {
    bucket = "hkd-prod-terraform"
    key = "hacksquad/terraform/terraform.tfstate"
    region = "us-east-1"
  }
}
