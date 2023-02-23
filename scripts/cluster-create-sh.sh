#!/usr/bin/env bash
kind delete cluster
kind create cluster
kind get clusters 
kubectl cluster-info --context kind-kind
kind get kubeconfig
