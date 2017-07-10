#!/usr/bin/env bash

cd /app

rm -rf dist && mkdir -p dist

NODE_ENV=production babel src -d dist

cp .env.production dist/.env
cp package-lock.json package.json dist

cd dist

npm install --production

cd ..

tar -czvf release.tar.gz dist

rm -rf dist
