#!/bin/bash


sysctl fs.protected_regular=0

minikube delete
minikube start --force

cd /root/Codelist
kubectl apply -f runners/codelist.yaml
echo -n $(minikube ip) > server/keys/cluster

pm2 kill
pm2 start server/server.js