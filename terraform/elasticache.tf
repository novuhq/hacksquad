resource "aws_elasticache_cluster" "redis" {
  cluster_id           = "${local.prefix}-redis-cluster"
  engine               = "redis"
  node_type            = var.redis_cluster_image
  num_cache_nodes      = 1
  parameter_group_name = "default.redis5.0"
  engine_version       = "5.0.6"
  port                 = 6379
  security_group_ids = [ aws_security_group.redis_cluster.id ]
  subnet_group_name = aws_elasticache_subnet_group.this.name
}


resource "aws_elasticache_subnet_group" "this" {
  name       = "${terraform.workspace}-es-subnet-group"
  subnet_ids = aws_subnet.private_subnet.*.id
}

resource "aws_security_group" "redis_cluster" {
  name        = "${local.prefix}-redis-cluster-sg"
  description = "allow inbound access from the ECS only"
  vpc_id      = aws_vpc.vpc.id

  ingress {
    protocol        = "tcp"
    from_port       = 6379
    to_port         = 6379
    security_groups = [module.api.ecs_security_group_id]
  }

  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_ssm_parameter" "redis_host_ssm" {
  name        = "/${local.prefix}/REDIS_HOST"
  description = "Host of redis Elasticache instance"
  type        = "SecureString"
  value       = aws_elasticache_cluster.redis.cache_nodes.0.address

  tags = {
    environment = terraform.workspace
  }
}
