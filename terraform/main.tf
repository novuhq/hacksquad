data "aws_ssm_parameter" "github_client_id" {
  name = "/${terraform.workspace}/GITHUB_OAUTH_CLIENT_ID"
}

data "aws_ssm_parameter" "github_client_secret" {
  name = "/${terraform.workspace}/GITHUB_OAUTH_CLIENT_SECRET"
}

data "aws_ssm_parameter" "github_token" {
  name = "/${terraform.workspace}/GITHUB_TOKEN"
}

data "aws_ssm_parameter" "sendgrid_api_key" {
  name = "/${terraform.workspace}/SENDGRID_API_KEY"
}

locals {
  prefix = terraform.workspace
  api_secrets = concat([
    {
      valueFrom: data.aws_ssm_parameter.github_client_id.arn,
      name: "GITHUB_OAUTH_CLIENT_ID"
    },
    {
      valueFrom: data.aws_ssm_parameter.github_client_secret.arn,
      name: "GITHUB_OAUTH_CLIENT_SECRET"
    },
    {
      valueFrom: data.aws_ssm_parameter.github_token.arn,
      name: "GITHUB_TOKEN"
    },
    {
      valueFrom: data.aws_ssm_parameter.sendgrid_api_key.arn,
      name: "SENDGRID_API_KEY"
    },
    {
      valueFrom: aws_ssm_parameter.mongo_db_ssm.arn,
      name: "MONGO_URL"
    },
    {
      name: "REDIS_HOST",
      valueFrom: aws_ssm_parameter.redis_host_ssm.arn
    },
    {
      name: "AWS_SECRET_ACCESS_KEY",
      valueFrom: aws_ssm_parameter.aws_secret_key.arn
    },
    {
      name: "AWS_ACCESS_KEY_ID",
      valueFrom: aws_ssm_parameter.aws_access_key_id.arn
    },
    {
      name: "JWT_SECRET",
      valueFrom: aws_ssm_parameter.jwt_secret.arn
    }
  ])

  environment_api = [
    {
      name: "S3_BUCKET_NAME",
      value: aws_s3_bucket.s3_bucket.bucket
    },
    {
      name: "S3_REGION",
      value: var.aws_region
    }
  ]

  certificate_domain = "*.hacksquad.dev"
}

module "api" {
  source = "./web-service"
  app_name = "${local.prefix}-api"
  domain_prefix = terraform.workspace == "prod" ? "api" : "${local.prefix}.api"
  aws_region = var.aws_region
  aws_vpc_id = aws_vpc.vpc.id
  execution_role_arn = aws_iam_role.ecs_task_execution_role.arn
  public_subnet_ids = aws_subnet.public_subnet.*.id
  private_subnet_ids = aws_subnet.private_subnet.*.id
  certificate_domain = local.certificate_domain
  environment = local.environment_api
  secrets = local.api_secrets
  app_port = 3000
  depends_on = [aws_acm_certificate.cert]
  auto_scale = true
}

terraform {
  required_providers {
    mongodbatlas = {
      source  = "mongodb/mongodbatlas"
      version = "0.9.1"
    }
  }
}

data "aws_caller_identity" "current" {}
