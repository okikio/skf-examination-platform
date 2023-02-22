#!/usr/bin/env bash
kind delete cluster
kind create cluster
kind get clusters & kind load docker-image workers:latest & kind load docker-image astro:latest
kubectl cluster-info --context kind-kind 