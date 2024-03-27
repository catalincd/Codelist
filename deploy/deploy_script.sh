#!/bin/bash

export PATH="$PATH:/root/.nvm/versions/node/v21.6.2/bin"

echo "Node version: $(node --version)"

cd Codelist

DOMAIN="codelist.ro"            # http://89.45.83.185
FULL_HOST="https://$DOMAIN"     # http://89.45.83.185
PORT="443"                      # 80

mkdir -p server/keys
echo -n $1 > server/keys/mongo_key
echo -n $2 > server/keys/jwt_key
cp /keys/ssl_cert server/keys/ssl_cert
cp /keys/ssl_key server/keys/ssl_key
cp /keys/ssl_ca server/keys/ssl_ca

echo -n $DOMAIN > server/hostname
echo -n "REACT_APP_HOSTNAME=$FULL_HOST" > ./frontend/.env
echo -n $PORT > server/port

cd frontend
npm install
npm run build
cd ..
rm -rf server/build
cp -r frontend/build server/build


cd server
npm install
cd ..

pm2 kill
pm2 start server/server.js
