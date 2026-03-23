#!/bin/bash

# 1. Define variables
AKS_RG="myAksResourceGroup"
LOCATION="eastus"
AKS_NAME="myAKSCluster"
ACR_NAME="tasbirul"

# 2. Create the Resource Group for AKS
az group create --name $AKS_RG --location $LOCATION

# 3. Create the Kubernetes Cluster (1 node)
az aks create --resource-group $AKS_RG --name $AKS_NAME --node-count 1 --generate-ssh-keys

# 4. Attach your existing ACR to the new cluster
az aks update -n $AKS_NAME -g $AKS_RG --attach-acr $ACR_NAME

# 5. Re-connect your local terminal
az aks get-credentials --resource-group $AKS_RG --name $AKS_NAME --overwrite-existing