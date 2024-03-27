#!/bin/bash

export PATH="$PATH:/root/.nvm/versions/node/v18.19.1/bin"

cd Codelist

DOMAIN="http://89.45.83.185"
PORT="80"

mkdir -p server/keys
echo -n $1 > server/keys/mongo_key
echo -n $2 > server/keys/jwt_key

echo -n $DOMAIN > server/hostname
echo -n "REACT_APP_HOSTNAME=$DOMAIN" > ./frontend/.env
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
