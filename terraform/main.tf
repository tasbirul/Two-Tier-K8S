# 1. Create the Resource Group for AKS
resource "azurerm_resource_group" "aks_rg" {
  name     = var.resource_group_name
  location = var.location
}

# We need a TLS private key to act as the SSH key (replaces az cli's --generate-ssh-keys)
resource "tls_private_key" "ssh" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

# 2. Create the Kubernetes Cluster (1 node)
resource "azurerm_kubernetes_cluster" "aks" {
  name                = var.aks_cluster_name
  location            = azurerm_resource_group.aks_rg.location
  resource_group_name = azurerm_resource_group.aks_rg.name
  dns_prefix          = "${var.aks_cluster_name}-dns"

  default_node_pool {
    name       = "default"
    node_count = 1
    vm_size    = "Standard_B2s" # Free-tier eligible / basic size. Change as needed (e.g. Standard_DS2_v2).
  }

  # Use System Assigned Identity for simpler ACR attachment
  identity {
    type = "SystemAssigned"
  }

  linux_profile {
    admin_username = "azureuser"
    ssh_key {
      key_data = tls_private_key.ssh.public_key_openssh
    }
  }
}

# 3. Reference the existing ACR
data "azurerm_container_registry" "acr" {
  name                = var.acr_name
  resource_group_name = var.acr_resource_group_name != "" ? var.acr_resource_group_name : azurerm_resource_group.aks_rg.name
}

# 4. Attach your existing ACR to the new cluster
# This grants the AKS cluster's Kubelet identity permission to pull images from the ACR.
resource "azurerm_role_assignment" "aks_acr_pull" {
  principal_id                     = azurerm_kubernetes_cluster.aks.kubelet_identity[0].object_id
  role_definition_name             = "AcrPull"
  scope                            = data.azurerm_container_registry.acr.id
  skip_service_principal_aad_check = true
}
