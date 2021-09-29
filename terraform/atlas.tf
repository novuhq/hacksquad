

resource "mongodbatlas_cluster" "mongo_cluster" {
  project_id = mongodbatlas_project.group.id
  name = "hacksquad-cluster-${terraform.workspace}"
  cluster_type = "REPLICASET"
  provider_backup_enabled = true
  auto_scaling_disk_gb_enabled = true
  mongo_db_major_version = "4.4"
  provider_region_name = var.atlas_region

  // Provider Settings "block"
  provider_name = "AWS"
  disk_size_gb = 20
  provider_instance_size_name = var.atlas_cluster_size
  depends_on = [mongodbatlas_network_container.atlas-network-container]
}

resource "mongodbatlas_project_ip_whitelist" "atlas-ip-whitelist" {
  project_id = mongodbatlas_project.group.id
  cidr_block = aws_vpc.vpc.cidr_block
  comment = "CIDR block for Staging AWS Public Subnet Access for Atlas"
}

resource "aws_vpc_peering_connection_accepter" "peer" {
  vpc_peering_connection_id = mongodbatlas_network_peering.atlas-network-peering.connection_id
  auto_accept = true
  tags = {
    Side      = "Accepter"
    Terraform = "true"
  }
}



resource "mongodbatlas_network_container" "atlas-network-container" {
  project_id = mongodbatlas_project.group.id
  atlas_cidr_block = "192.168.248.0/21"
  provider_name = "AWS"
  region_name = var.atlas_region
}

resource "mongodbatlas_network_peering" "atlas-network-peering" {
  accepter_region_name = var.aws_region
  project_id = mongodbatlas_project.group.id
  container_id = mongodbatlas_network_container.atlas-network-container.container_id
  provider_name = "AWS"
  route_table_cidr_block = aws_vpc.vpc.cidr_block
  vpc_id = aws_vpc.vpc.id
  aws_account_id = data.aws_caller_identity.current.account_id
}

resource "aws_route" "aws_peer_to_atlas_route_1" {
  route_table_id = aws_route_table.private.id
  destination_cidr_block = mongodbatlas_network_container.atlas-network-container.atlas_cidr_block
  vpc_peering_connection_id = mongodbatlas_network_peering.atlas-network-peering.connection_id
}

resource "aws_ssm_parameter" "mongo_db_ssm" {
  name        = "/${local.prefix}/MONGO_URL"
  description = "Host of Mongo instance"
  type        = "SecureString"
  value       = "mongodb+srv://${mongodbatlas_database_user.this.username}:${mongodbatlas_database_user.this.password}@${substr(mongodbatlas_cluster.mongo_cluster.connection_strings[0].standard_srv, 14, -1)}/${local.database_name}"

  tags = {
    environment = terraform.workspace
  }
}

data "aws_ssm_parameter" "atlas_org_id" {
  name = "/GENERAL/ATLAS_ORG_ID"
}

resource "mongodbatlas_project" "group" {
  name = "Hacksquad - ${terraform.workspace} - DB"
  org_id = data.aws_ssm_parameter.atlas_org_id.value
}

resource "random_password" "password" {
  length           = 16
  special          = true
  override_special = "_"
}

locals {
  database_name = "hacksquad-${terraform.workspace}-db"
}

resource "mongodbatlas_database_user" "this" {
  username = "hkd-${terraform.workspace}-app-user"
  password = random_password.password.result
  auth_database_name = "admin"

  roles {
    role_name = "readWrite"
    database_name = local.database_name
  }

  project_id = mongodbatlas_project.group.id
}
