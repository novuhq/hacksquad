
resource "aws_alb" "ws" {
  name            = "${var.app_name}-load-balancer"
  subnets         = var.public_subnet_ids
  security_groups = [aws_security_group.lb.id]
}

resource "aws_alb_target_group" "app" {
  name        = "${var.app_name}-target-group"
  port        = var.app_port
  protocol    = "HTTP"
  vpc_id      = var.aws_vpc_id
  target_type = "ip"

  health_check {
    healthy_threshold   = "3"
    interval            = "30"
    protocol            = "HTTP"
    matcher             = "200"
    timeout             = "3"
    path                = var.health_check_path
    unhealthy_threshold = "2"
  }
}

# Redirect all traffic from the ALB to the target group
resource "aws_alb_listener" "front_end" {
  load_balancer_arn = aws_alb.ws.id
  port              = 80
  protocol          = "HTTP"

  default_action {
    type = "redirect"

    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }
}

data "aws_acm_certificate" "issued" {
  domain   = var.certificate_domain
  statuses = ["ISSUED"]
}

# Redirect all traffic from the ALB to the target group
resource "aws_alb_listener" "front_end_ssl" {
  load_balancer_arn = aws_alb.ws.id
  port              = 443
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-2016-08"
  certificate_arn   = data.aws_acm_certificate.issued.arn

  default_action {
    target_group_arn = aws_alb_target_group.app.id
    type             = "forward"
  }
}

data "aws_route53_zone" "primary" {
  name         = "hacksquad.dev."
}

output "endpoint" {
  value = "https://${var.domain_prefix}.hacksquad.dev"
}

resource "aws_route53_record" "alias_route53_record" {
  zone_id = data.aws_route53_zone.primary.zone_id # Replace with your zone ID
  name    = "${var.domain_prefix}.hacksquad.dev" # Replace with your name/domain/subdomain
  type    = "A"

  alias {
    name                   = aws_alb.ws.dns_name
    zone_id                = aws_alb.ws.zone_id
    evaluate_target_health = true
  }
}
