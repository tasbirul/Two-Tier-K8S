# Full-Stack Application Deployment on Azure Kubernetes Service (AKS)

## Project Overview

This repository demonstrates an end-to-end cloud-native deployment of a full-stack application (Angular frontend and .NET 8 Web API backend) to Azure Kubernetes Service (AKS). The primary focus of this project is to showcase modern DevOps, Cloud Engineering, and Kubernetes administration practices. It features infrastructure automation, optimized containerization, and a robust Continuous Integration / Continuous Deployment (CI/CD) pipeline.

## Key Technologies

- **Cloud Platform**: Microsoft Azure
- **Infrastructure as Code (IaC)**: Terraform, Azure CLI
- **Containerization**: Docker
- **Container Registry**: Azure Container Registry (ACR)
- **Container Orchestration**: Kubernetes (AKS)
- **Package Management**: Helm
- **CI/CD**: Azure Pipeline

## Engineering and DevOps Practices

### 1. Infrastructure as Code (Terraform)
The core cloud infrastructure is defined declaratively using Terraform, enabling reproducible environments. 
- Provisions Azure Resource Groups and standard Azure Kubernetes Service (AKS) clusters.
- Configures System Assigned Managed Identities instead of static credentials.
- Automates Role-Based Access Control (RBAC) securely, granting the AKS Kubelet identity explicit `AcrPull` permissions to the Azure Container Registry.
- A fallback structural initialization script (`spin-up.sh`) is provided for rapid validation.

### 2. Advanced Containerization 
The application relies on a highly optimized, multi-stage Dockerfile tailored for performance and security in production environments.
- Utilizes distinct build stages for Node.js (Angular) and the .NET SDK to leverage layer caching effectively and accelerate CI pipeline speeds.
- Compiles both components into a single, minimal footprint Alpine Linux runtime image.
- Enforces container security best practices by executing the workload under a restricted, non-root user (`appuser`).

### 3. Kubernetes Orchestration via Helm
Deployment to the Kubernetes cluster is managed entirely through a custom Helm chart (`angular-dotnet-chart`).
- Abstracts complex Kubernetes manifests (Deployments, Services, Namespaces).
- Provides flexibility to dynamically inject configuration variables (e.g., image tags, replica counts) directly from the release pipeline.

### 4. Continuous Integration and Continuous Deployment (CI/CD)
A mature, multi-stage Azure Pipeline (`azure-pipelines.yml`) manages the complete software delivery lifecycle.
- **Continuous Integration (CI)**: Triggered by branch updates, the pipeline instructs a runner to build the Docker image, tag it with a unique Build ID, and push the artifact securely to Azure Container Registry. Helm chart artifacts are also statically published.
- **Continuous Deployment (CD)**: Downloads the published Helm chart and executes a zero-downtime deployment strategy to the AKS cluster using the newly pushed application image.
- **Automated Rollback**: The CD pipeline incorporates an automatic `Helm Rollback` listener, which triggers immediately to revert the release to the previous working revision if the deployment process encounters an error.

## Repository Structure

```text
.
├── angular-dotnet-chart/   # Kubernetes deployment manifests packaged as a Helm Chart
├── api/                    # .NET Web API backend source code
├── client/                 # Angular frontend source code
├── terraform/              # Terraform IaC definitions for AKS and Azure resources
├── azure-pipelines.yml     # Azure DevOps CI/CD pipeline configuration
├── Dockerfile              # Multi-stage container instructions
└── spin-up.sh              # Fallback CLI script for cluster provisioning
```

## Setup and Deployment Guide

### Phase 1: Infrastructure Provisioning

Navigate to the `terraform` directory to initialize and apply the infrastructure configuration. Ensure you are authenticated with Azure (`az login`).

```bash
cd terraform
terraform init
terraform plan
terraform apply
```
This action will yield the resource group, AKS cluster, and securely link the AKS identity to your existing ACR.

### Phase 2: Pipeline Execution

1. Configure an Azure Resource Manager Service Connection within your Azure DevOps project.
2. Update the `azure-pipelines.yml` variables (e.g., `dockerRegistryServiceConnection`, `containerRegistry`) to match your specific Azure environment.
3. Commit and push the changes to initiate the pipeline automatically. Monitor the pipeline runs to observe the automated build, registry push, and Helm deployment phases culminating in a live application on your AKS cluster.

## Conclusion

This repository serves as a practical demonstration of integrating diverse technologies into a unified, reliable, and scalable automated deployment flow, characteristic of enterprise-level Cloud infrastructure engineering.
