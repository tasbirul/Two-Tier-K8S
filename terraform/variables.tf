variable "resource_group_name" {
  description = "The name of the Resource Group to create."
  type        = string
  default     = "myAksResourceGroup"
}

variable "location" {
  description = "The Azure Region where resources should be created."
  type        = string
  default     = "eastus"
}

variable "aks_cluster_name" {
  description = "The name of the AKS cluster."
  type        = string
  default     = "myAKSCluster"
}

variable "acr_name" {
  description = "The name of the existing Azure Container Registry to attach."
  type        = string
  default     = "tasbirul"
}

variable "acr_resource_group_name" {
  description = "The Resource Group of the existing Azure Container Registry. Defaults to the new AKS Resource Group if empty."
  type        = string
  default     = ""
}
