#!/usr/bin/env bash
for yaml in k8s/*.yaml; do
    kubectl apply -f $yaml;
done

# helm repo add nginx-stable https://helm.nginx.com/stable
# helm repo update
# helm install nginx-ingress nginx-stable/nginx-ingress  \
#     --set controller.image.repository=quay.io/kubernetes-ingress-controller/nginx-ingress-controller-arm \
#     --set controller.image.tag=0.32.0 \
#     --set defaultBackend.enabled=false \
#     --set controller.publishService.enabled=true \
#     --set controller.service.externalTrafficPolicy=Local 