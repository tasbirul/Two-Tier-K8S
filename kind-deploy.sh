#!/bin/bash
set -e

CLUSTER_NAME="angular-dotnet-local"
IMAGE_NAME="angular-dotnet:local"
NAMESPACE="angular-dotnet"
RELEASE_NAME="my-angular-app"

echo "🚀 Starting Local Kubernetes Development Environment Setup..."

# 1. Check if kind is installed
if ! command -v kind &> /dev/null; then
    echo "❌ 'kind' is not installed. Please install it first: https://kind.sigs.k8s.io/"
    exit 1
fi

if ! command -v helm &> /dev/null; then
    echo "❌ 'helm' is not installed. Please install it first: https://helm.sh/"
    exit 1
fi

# 2. Check if the Kind cluster already exists
if ! kind get clusters | grep -q "^${CLUSTER_NAME}$"; then
    echo "📦 Creating kind cluster: ${CLUSTER_NAME}..."
    kind create cluster --name ${CLUSTER_NAME}
else
    echo "✅ kind cluster '${CLUSTER_NAME}' already exists."
    # Ensure our context is set to this cluster
    kubectl config use-context kind-${CLUSTER_NAME}
fi

# 3. Build the Docker image locally
echo "🐳 Building Docker image: ${IMAGE_NAME}..."
docker build -t ${IMAGE_NAME} .

# 4. Load the image into the kind cluster
# Kind cannot pull local images by default; they must be side-loaded.
echo "📥 Loading image into kind cluster..."
kind load docker-image ${IMAGE_NAME} --name ${CLUSTER_NAME}

# 5. Deploy via Helm
# Overriding values to use the locally built image
echo "☸️  Deploying application to Kubernetes via Helm..."
helm upgrade --install ${RELEASE_NAME} ./angular-dotnet-chart \
  --namespace ${NAMESPACE} \
  --create-namespace \
  --set image.repository=angular-dotnet \
  --set image.tag=local \
  --set image.pullPolicy=Never

echo ""
echo "✅ Application deployed successfully to local 'kind' cluster!"
echo "➡️  To access the application, run the following command in your terminal:"
echo ""
echo "    kubectl port-forward svc/angular-dotnet 8080:80 -n ${NAMESPACE}"
echo ""
echo "    Then open your browser to: http://localhost:8080"
