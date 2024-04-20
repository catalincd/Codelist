#!/bin/bash

kubectl delete service codelist-entrypoint
kubectl delete deployment codelist-deployment

minikube stop --force
minikube start --force


cd /root/Codelist
kubectl apply -f runners/codelist.yaml
echo -n $(minikube ip) > server/keys/cluster
