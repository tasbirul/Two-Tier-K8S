output "resource_group_name" {
  description = "The name of the created resource group."
  value       = azurerm_resource_group.aks_rg.name
}

output "kubernetes_cluster_name" {
  description = "The name of the AKS cluster."
  value       = azurerm_kubernetes_cluster.aks.name
}

output "kube_config" {
  description = "The kubeconfig to connect to the AKS cluster."
  value       = azurerm_kubernetes_cluster.aks.kube_config_raw
  sensitive   = true
}

output "ssh_private_key" {
  description = "The generated SSH private key for the AKS nodes."
  value       = tls_private_key.ssh.private_key_pem
  sensitive   = true
}

output "acr_attached" {
  description = "The ID of the ACR that was connected to the AKS cluster."
  value       = data.azurerm_container_registry.acr.id
}
