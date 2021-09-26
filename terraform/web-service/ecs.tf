
resource "aws_ecs_cluster" "main" {
  name = "${var.app_name}-cluster"
}

data "template_file" "cb_app" {
  template = file("./web-service/templates/ecs/cb_app.json.tpl")

  vars = {
    app_name       = var.app_name
    app_image      = "${aws_ecr_repository.this.repository_url}:${terraform.workspace}"
    container_name = aws_ecr_repository.this.name
    app_port       = var.app_port
    fargate_cpu    = var.fargate_cpu
    fargate_memory = var.fargate_memory
    aws_region     = var.aws_region
    environment    = jsonencode(var.environment)
    secrets        = jsonencode(var.secrets)
  }
}

resource "aws_ecs_task_definition" "app" {
  family                   = "${var.app_name}-task"
  execution_role_arn       = var.execution_role_arn
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.fargate_cpu
  memory                   = var.fargate_memory
  container_definitions    = data.template_file.cb_app.rendered
}

resource "aws_ecs_service" "main" {
  name            = "${var.app_name}-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.app.family
  desired_count   = var.app_count
  launch_type     = "FARGATE"

  lifecycle {
    ignore_changes = [desired_count]
  }

  network_configuration {
    security_groups  = [aws_security_group.ecs_tasks.id]
    subnets          = var.private_subnet_ids
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_alb_target_group.app.id
    container_name   = aws_ecr_repository.this.name
    container_port   = var.app_port
  }

  depends_on = [aws_alb_listener.front_end, aws_alb_listener.front_end_ssl, var.execution_role_arn]
}

resource "aws_appautoscaling_target" "target_auto_scale" {
  count = var.auto_scale == true ? 1 : 0
  max_capacity = 2
  min_capacity = 1
  resource_id = "service/${aws_ecs_cluster.main.name}/${aws_ecs_service.main.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace = "ecs"
}

resource "aws_appautoscaling_policy" "memory_scale" {
  count = var.auto_scale == true ? 1 : 0
  name               = "${var.app_name}-memory-auto-scale-policy"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.target_auto_scale[count.index].resource_id
  scalable_dimension = aws_appautoscaling_target.target_auto_scale[count.index].scalable_dimension
  service_namespace  = aws_appautoscaling_target.target_auto_scale[count.index].service_namespace

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageMemoryUtilization"
    }

    target_value       = 80
  }
}

resource "aws_appautoscaling_policy" "cpu_scale" {
  count = var.auto_scale ? 1 : 0
  name = "dev-to-cpu"
  policy_type = "TargetTrackingScaling"
  resource_id = aws_appautoscaling_target.target_auto_scale[count.index].resource_id
  scalable_dimension = aws_appautoscaling_target.target_auto_scale[count.index].scalable_dimension
  service_namespace = aws_appautoscaling_target.target_auto_scale[count.index].service_namespace

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }

    target_value = 60
  }
}

