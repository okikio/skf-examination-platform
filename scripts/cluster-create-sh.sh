#!/usr/bin/env bash
kind delete cluster
kind create cluster
kind get clusters & kind load docker-image workers:skf & kind load docker-image astro:skf
kubectl cluster-info --context kind-kind 