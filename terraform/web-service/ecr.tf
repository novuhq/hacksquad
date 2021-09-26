resource "aws_ecr_repository" "this" {
  name                 = "${var.app_name}-container"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = false
  }
}
