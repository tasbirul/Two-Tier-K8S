#!/bin/bash
set -e

NAMESPACE="monitoring"
RELEASE_NAME="prometheus"

echo "Setting up Prometheus and Grafana (kube-prometheus-stack)..."

# 1. Add the prometheus-community Helm repository
echo "Adding Prometheus Community Helm Repository..."
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

# 2. Install the kube-prometheus-stack
echo "Installing kube-prometheus-stack in namespace '${NAMESPACE}'..."
# We use --set prometheus.prometheusSpec.scrapeInterval=15s to make metrics appear faster for local testing
helm upgrade --install ${RELEASE_NAME} prometheus-community/kube-prometheus-stack \
  --namespace ${NAMESPACE} \
  --create-namespace \
  --set grafana.adminPassword=prom-operator

echo ""
echo "Prometheus & Grafana installed successfully!"
echo "To access Grafana, run this command in a new terminal:"
echo ""
echo "    kubectl port-forward svc/${RELEASE_NAME}-grafana 8081:80 -n ${NAMESPACE}"
echo ""
echo "    Then open your browser to: http://localhost:8081"
echo "    Default login -> username: admin | password: prom-operator"
