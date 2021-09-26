variable "aws_region" {
  description = "The AWS region things are created in"
}

variable "app_port" {
  description = "Port exposed by the docker image to redirect traffic to"
}
variable "app_name" {}

variable "domain_prefix" {}

variable "app_count" {
  description = "Number of docker containers to run"
  default     = 1
}

variable "health_check_path" {
  default = "/v1/health-check"
}

variable "auto_scale" {
  default = false
}

variable "fargate_cpu" {
  description = "Fargate instance CPU units to provision (1 vCPU = 1024 CPU units)"
  default     = "512"
}

variable "fargate_memory" {
  description = "Fargate instance memory to provision (in MiB)"
  default     = "1024"
}

variable "aws_vpc_id" {}

variable "execution_role_arn" {}

variable "public_subnet_ids" {

}

variable "private_subnet_ids" {

}

variable "certificate_domain" {}

variable "secrets" {}

variable "environment" {}
