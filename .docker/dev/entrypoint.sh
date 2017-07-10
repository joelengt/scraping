#!/usr/bin/env bash

cd /app

if [ ! -d "/app/node_modules" ]; then
  npm install
fi;

if [ ! -f "/app/.env" ]; then
  cp .env.example .env
fi;

exec $@
