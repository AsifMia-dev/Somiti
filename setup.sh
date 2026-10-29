#!/usr/bin/env bash
set -e

echo "== Checking Node.js =="
if ! command -v node &> /dev/null; then
  echo "Node not found. Install nvm first: https://github.com/nvm-sh/nvm"
  echo "Then run: nvm install --lts"
  exit 1
fi
echo "Node $(node -v), npm $(npm -v)"

echo "== Server =="
cd Server
npm install
npx prisma generate

if [ ! -f .env ]; then
  echo "WARNING: Server/.env is missing."
  echo "Create it with DATABASE_URL and your other secrets before running the server."
fi
cd ..

echo "== Client =="
cd Client
npm install
cd ..

echo "== Setup complete =="