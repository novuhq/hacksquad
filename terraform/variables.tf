variable "aws_region" {
  description = "The AWS region things are created in"
  default = "eu-central-1"
}

variable "ecs_task_execution_role_name" {
  description = "ECS task execution role name"
  default = "hkdEcsTaskExecutionRole"
}

variable "ecs_auto_scale_role_name" {
  description = "ECS auto scale role Name"
  default = "hkdEcsAutoScaleRole"
}

variable "az_count" {
  description = "Number of AZs to cover in a given region"
  default = "2"
}

variable "redis_cluster_image" {
  default = "cache.t2.small"
}

variable "aws_profile" {
  default = "hacksquad-prod"
}

variable "atlas_region" {
  default = "EU_CENTRAL_1"
  description = "Atlas Region"
}

variable "atlas_org_id" {
  description = "Atlas Org ID"
  default = "60a80f3002a6a87e1c803c0b"
}

variable "atlas_cluster_size" {
  description = "M10, M30"
  default = "M10"
}

variable "vpc_id" {
  default = "vpc-588e1333"
}

variable "ecs_secrets" {
  default = []
}
