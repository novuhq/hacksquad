
resource "aws_iam_user" "user" {
  name = "srv_${local.prefix}_user"
}

resource "aws_iam_access_key" "src_user_key" {
  user = aws_iam_user.user.name
}

resource "aws_s3_bucket_policy" "bucket_policy" {
  bucket = aws_s3_bucket.s3_bucket.id

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "${aws_iam_user.user.arn}"
      },
      "Action": [ "s3:*" ],
      "Resource": [
        "${aws_s3_bucket.s3_bucket.arn}",
        "${aws_s3_bucket.s3_bucket.arn}/*"
      ]
    }
  ]
}
EOF
}

resource "aws_ssm_parameter" "aws_access_key_id" {
  name        = "/${local.prefix}/AWS_ACCESS_KEY_ID"
  description = "AWS_ACCESS_KEY_ID"
  type        = "SecureString"
  value       = aws_iam_access_key.src_user_key.id

  tags = {
    environment = terraform.workspace
  }
}

resource "aws_ssm_parameter" "aws_secret_key" {
  name        = "/${local.prefix}/AWS_SECRET_ACCESS_KEY"
  description = "AWS_SECRET_ACCESS_KEY"
  type        = "SecureString"
  value       = aws_iam_access_key.src_user_key.secret

  tags = {
    environment = terraform.workspace
  }
}
