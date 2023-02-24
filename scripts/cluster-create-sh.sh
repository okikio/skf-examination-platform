#!/usr/bin/env bash

kind delete cluster
kind create cluster
kind get clusters 
kubectl cluster-info --context kind-kind

#copy kube config file so we can use it inside the workers container
cp /home/node/.kube/config ./k8s/kubeconf

#replace ip+port to https://kubernetes
find ./k8s/kubeconf -type f -exec sed -i -e "s,https://127.0.0.1:.*,https://kubernetes,g" {} \;

