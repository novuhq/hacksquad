
resource "random_password" "jwt_secret" {
  length           = 16
  special          = true
  override_special = "_$%"
}

resource "aws_ssm_parameter" "jwt_secret" {
  name        = "/${local.prefix}/JWT_SECRET"
  description = "JWT generation secret"
  type        = "SecureString"
  value       = random_password.jwt_secret.result

  tags = {
    environment = terraform.workspace
  }
}
