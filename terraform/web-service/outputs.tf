output "service_alb" {
  value = aws_alb.ws.dns_name
}

output "ecs_security_group_id" {
  value = aws_security_group.ecs_tasks.id
}

output "ecs-cluster" {
  value = aws_ecs_cluster.main.name
}

output "ecs-service" {
  value = aws_ecs_service.main.name
}

output "ecs-container-name" {
  value = jsondecode(data.template_file.cb_app.rendered)[0].name
}

output "ecs-task-name" {
  value = aws_ecs_task_definition.app.family
}
