# BharatSolve AI -- AWS Infrastructure (Terraform)

Production-grade AWS infrastructure using Terraform. Provisions a resilient, autoscaling deployment with Application Load Balancer, ECS Fargate, RDS PostgreSQL, and Secrets Manager.

---

## Architecture Diagram

```
                        ┌─────────────────┐
                        │   Route 53 DNS  │
                        └────────┬────────┘
                                 │
                        ┌────────▼────────┐
                        │  ACM (SSL/TLS)  │
                        └────────┬────────┘
                                 │
                ┌────────────────▼────────────────┐
                │   Application Load Balancer     │
                │   (Public Subnets, 2 AZs)       │
                │   Port 443 → Target Group:3000  │
                └──────────┬───────────┬──────────┘
                           │           │
              ┌────────────▼──┐  ┌─────▼───────────┐
              │  ECS Task (1) │  │  ECS Task (2)    │
              │  Fargate      │  │  Fargate         │
              │  Private Sub  │  │  Private Sub     │
              └──────┬────────┘  └──────┬───────────┘
                     │                  │
              ┌──────▼──────────────────▼──────┐
              │       RDS PostgreSQL 16         │
              │    (Private Subnets, Multi-AZ)  │
              │    db.t3.micro (min config)     │
              └────────────────────────────────┘
```

---

## Prerequisites

| Tool | Version |
|---|---|
| Terraform | >= 1.5 |
| AWS CLI | v2 |
| Docker | 20+ |

Ensure your AWS CLI is configured:
```bash
aws configure
# Or use environment variables:
# export AWS_ACCESS_KEY_ID=...
# export AWS_SECRET_ACCESS_KEY=...
# export AWS_DEFAULT_REGION=ap-south-1
```

---

## File Structure

```
infrastructure/
├── README.md              # This file
├── main.tf                # Provider, VPC, core resources
├── ecs.tf                 # ECS cluster, task, service, autoscaling
├── rds.tf                 # RDS PostgreSQL instance
├── alb.tf                 # Application Load Balancer + target group
├── secrets.tf             # Secrets Manager for env vars
├── outputs.tf             # Output values (ALB DNS, etc.)
├── variables.tf           # Input variables with defaults
├── terraform.tfvars.example # Example variable values
└── environments/
    ├── prod.tfvars        # Production overrides
    └── staging.tfvars     # Staging overrides
```

---

## Quick Start

### 1. Initialize Terraform

```bash
cd infrastructure
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your values

terraform init
```

### 2. Create Secrets in AWS

Before applying, store your secrets in AWS Secrets Manager:

```bash
aws secretsmanager create-secret \
  --name bharatsolve/prod/env \
  --secret-string '{
    "SESSION_SECRET": "your-strong-secret",
    "OPENAI_API_KEY": "sk-your-key",
    "DATABASE_URL": "will-be-set-by-terraform"
  }'
```

### 3. Plan and Apply

```bash
terraform plan -var-file=environments/prod.tfvars
terraform apply -var-file=environments/prod.tfvars
```

### 4. Push Docker Image to ECR

```bash
# Get the ECR repository URL from Terraform output
ECR_URL=$(terraform output -raw ecr_repository_url)

# Authenticate Docker with ECR
aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin $ECR_URL

# Build and push
docker build -t bharatsolve-ai ..
docker tag bharatsolve-ai:latest $ECR_URL:latest
docker push $ECR_URL:latest

# Force new deployment
aws ecs update-service --cluster bharatsolve-cluster --service bharatsolve-service --force-new-deployment
```

### 5. Run Database Migration

```bash
# Use ECS exec or a one-off task
aws ecs run-task \
  --cluster bharatsolve-cluster \
  --task-definition bharatsolve-migrate \
  --launch-type FARGATE \
  --network-configuration '{...}'
```

---

## Minimum Configuration for Resilience

The default configuration is designed for **cost-effective resilience**:

| Resource | Configuration | Monthly Cost (est.) |
|---|---|---|
| ECS Fargate | 2 tasks, 0.25 vCPU, 512MB each | ~$15 |
| RDS PostgreSQL | db.t3.micro, 20GB, Single-AZ | ~$15 |
| ALB | 1 ALB, low traffic | ~$18 |
| NAT Gateway | 1 (single-AZ) | ~$32 |
| ECR | 1 repository | ~$1 |
| Secrets Manager | 1 secret | ~$1 |
| **Total** | | **~$82/month** |

### Scaling Recommendations

| Stage | ECS Tasks | RDS Instance | NAT Gateways | Est. Cost |
|---|---|---|---|---|
| **MVP / Dev** | 1 task (0.25 vCPU) | db.t3.micro, Single-AZ | 1 | ~$55/month |
| **Small Prod** | 2 tasks (0.25 vCPU) | db.t3.micro, Multi-AZ | 1 | ~$82/month |
| **Medium Prod** | 2-4 tasks (0.5 vCPU) | db.t3.small, Multi-AZ | 2 | ~$180/month |
| **Large Prod** | 4-10 tasks (1 vCPU) | db.r6g.large, Multi-AZ | 2 | ~$500/month |

---

## Autoscaling Configuration

ECS autoscaling is configured with two policies:

### CPU-Based Scaling
- **Target**: 70% average CPU utilization
- **Min tasks**: 2 (for high availability)
- **Max tasks**: 10
- **Scale-in cooldown**: 300 seconds
- **Scale-out cooldown**: 60 seconds

### Memory-Based Scaling
- **Target**: 80% average memory utilization

### How It Works

```
Traffic increases
  → ECS tasks CPU rises above 70%
  → CloudWatch alarm triggers
  → ECS adds new tasks (up to max 10)
  → ALB distributes traffic to new tasks
  → Load normalizes

Traffic decreases
  → CPU drops below 70% for 5 minutes
  → ECS removes tasks (down to min 2)
```

---

## Load Balancer Configuration

### Health Check

```
Path:     /api/auth/user
Interval: 30 seconds
Timeout:  5 seconds
Healthy:  2 consecutive checks
Unhealthy: 3 consecutive checks
```

### Listener Rules

| Listener | Action |
|---|---|
| HTTPS (443) | Forward to target group on port 3000 |
| HTTP (80) | Redirect to HTTPS |

### Stickiness

Not required -- the app uses server-side sessions stored in PostgreSQL, so any ECS task can serve any request.

---

## Destroying Infrastructure

```bash
terraform destroy -var-file=environments/prod.tfvars
```

**Warning**: This will destroy ALL resources including the database. Ensure you have backups.

---

## Cost Optimization Tips

1. **Use Fargate Spot** for non-critical environments (60-70% savings)
2. **Reserved Instances** for RDS if committing for 1+ year (30-40% savings)
3. **Single NAT Gateway** is fine for small deployments (saves ~$32/month vs dual-AZ)
4. **Right-size ECS tasks** -- start with 0.25 vCPU/512MB and scale based on actual usage
5. **Enable RDS auto-pause** for dev/staging (stops billing when idle)
6. **Use CloudFront CDN** in front of the ALB to reduce ALB costs and improve global latency
