#!/bin/bash

set -ex

echo $1 > server/hostname
echo $2 > server/port
echo "REACT_APP_HOSTNAME=$3" > frontend/.env

cd frontend
npm run build
cd ..
rm -rf server/build
cp -r frontend/build server/build

