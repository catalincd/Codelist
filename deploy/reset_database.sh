#!/bin/bash

export PATH="$PATH:/root/.nvm/versions/node/v21.6.2/bin"
echo "Node version: $(node --version)"

docker kill mongodb
docker remove mongodb
docker run --name mongodb -d -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=user -e MONGO_INITDB_ROOT_PASSWORD=$1 mongodb/mongodb-community-server

cd /root/Codelist
echo -n "1" > server/keys/seed

pm2 kill
pm2 start server/server.js
