data "aws_availability_zones" "available" {
}

data "aws_security_group" "selected" {
  name   = "default"
  vpc_id = aws_vpc.vpc.id
}
