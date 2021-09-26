

output "api_endpoint" {
  value = module.api.endpoint
}

output "api_service_alb" {
  value = module.api.service_alb
}

output "api_ecs_cluster" {
  value = module.api.ecs-cluster
}

output "api_ecs_service" {
  value =  module.api.ecs-service
}

output "api_ecs_container_name" {
  value =  module.api.ecs-container-name
}

output "api_task_name" {
  value = module.api.ecs-task-name
}


