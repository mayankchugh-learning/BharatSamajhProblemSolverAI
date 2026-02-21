# ─────────────────────────────────────────────
# RDS Subnet Group
# ─────────────────────────────────────────────

resource "aws_db_subnet_group" "main" {
  name       = "${local.name_prefix}-db-subnet"
  subnet_ids = aws_subnet.private[*].id

  tags = { Name = "${local.name_prefix}-db-subnet" }
}

# ─────────────────────────────────────────────
# RDS PostgreSQL Instance
# ─────────────────────────────────────────────

resource "aws_db_instance" "main" {
  identifier = "${local.name_prefix}-db"

  engine         = "postgres"
  engine_version = "16.4"
  instance_class = var.db_instance_class

  allocated_storage     = var.db_allocated_storage
  max_allocated_storage = var.db_allocated_storage * 2
  storage_encrypted     = true

  db_name  = var.db_name
  username = var.db_username
  password = random_password.db.result

  multi_az               = var.db_multi_az
  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.rds.id]

  backup_retention_period = 7
  backup_window           = "03:00-04:00"
  maintenance_window      = "Mon:04:00-Mon:05:00"

  skip_final_snapshot       = false
  final_snapshot_identifier = "${local.name_prefix}-db-final"
  deletion_protection       = true

  performance_insights_enabled = false

  tags = { Name = "${local.name_prefix}-db" }
}

# ─────────────────────────────────────────────
# Random Password for RDS
# ─────────────────────────────────────────────

resource "random_password" "db" {
  length  = 32
  special = false
}

# ─────────────────────────────────────────────
# Store DATABASE_URL in Secrets Manager
# ─────────────────────────────────────────────

resource "aws_secretsmanager_secret_version" "db_url" {
  secret_id = aws_secretsmanager_secret.app_env.id

  secret_string = jsonencode({
    DATABASE_URL    = "postgresql://${var.db_username}:${random_password.db.result}@${aws_db_instance.main.endpoint}/${var.db_name}"
    SESSION_SECRET  = random_password.session_secret.result
    OPENAI_API_KEY  = "REPLACE_ME"
  })

  lifecycle {
    ignore_changes = [secret_string]
  }
}

resource "random_password" "session_secret" {
  length  = 64
  special = false
}
