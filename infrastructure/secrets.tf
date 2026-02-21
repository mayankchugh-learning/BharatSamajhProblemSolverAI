# ─────────────────────────────────────────────
# Secrets Manager
# ─────────────────────────────────────────────

resource "aws_secretsmanager_secret" "app_env" {
  name                    = "${local.name_prefix}/env"
  description             = "Environment variables for BharatSolve AI"
  recovery_window_in_days = 7

  tags = { Name = "${local.name_prefix}-secrets" }
}
