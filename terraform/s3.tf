resource "aws_s3_bucket" "s3_bucket" {
  bucket = "${local.prefix}-hacksquad-app-bucket"
  acl    = "private"

  tags = {
    Name = "${local.prefix}-hacksquad-app-bucket"
    Environment = terraform.workspace
  }

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["PUT", "POST"]
    allowed_origins = ["https://hacksquad.dev"]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}

