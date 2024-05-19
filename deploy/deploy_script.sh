#!/bin/bash

export PATH="$PATH:/root/.nvm/versions/node/v21.6.2/bin"
echo "Node version: $(node --version)"

pm2 kill
cd /opt/mailcow-dockerized/
docker compose down             # will kill mailcow and the running process due to low mem
minikube stop 

mkdir -p /root/Codelist
cd /root/Codelist

DOMAIN="codelist.ro"            # http://89.45.83.185
FULL_HOST="https://$DOMAIN"     # http://89.45.83.185
PORT="443"                      # 80

mkdir -p server/keys
echo -n $1 > server/keys/mongo_key
echo -n $2 > server/keys/jwt_key
echo -n $3 > server/keys/noreply_password
cp /keys/ssl_cert server/keys/ssl_cert
cp /keys/ssl_key server/keys/ssl_key
cp /keys/ssl_ca server/keys/ssl_ca

# maybe add '/keys/client' and '/keys/google' files

echo -n $DOMAIN > server/hostname
echo "REACT_APP_HOSTNAME=$FULL_HOST" > ./frontend/.env
echo "REACT_APP_GOOGLE_CLIENT_ID=$4" >> frontend/.env
echo "REACT_APP_REDIRECT_URI=$FULL_HOST/callback" >> frontend/.env

echo -n $PORT > server/port

cd frontend
npm install
npm run build
cd ..
rm -rf server/build
cp -r frontend/build server/build

mkdir -p server/build/images
mkdir -p server/logs

cp server/utils/res/default.png server/build/images/default.png

minikube start --force

echo "0" > server/keys/debug
echo "0" > server/keys/seed
echo -n $(minikube ip 2>/dev/null || echo "localhost") > server/keys/cluster

cd server
npm install
cd ..

docker start mongodb

pm2 start server/server.js
cd /opt/mailcow-dockerized/
docker compose up -d
