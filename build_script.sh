#!/bin/bash

set -ex

echo $1 > server/hostname
echo $1 > frontend/hostname

echo $2 > server/port
echo $2 > frontend/port

cd frontend
npm run build
cd ..
rm -rf server/build
cp -r frontend/build server/build

