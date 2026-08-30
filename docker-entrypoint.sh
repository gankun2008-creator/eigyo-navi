#!/bin/sh
set -eu

mkdir -p "$DATA_DIR"
if [ ! -f "$DATA_DIR/companies.sqlite" ]; then
  cp /app/seed-data/companies.sqlite "$DATA_DIR/companies.sqlite"
fi
if [ ! -f "$DATA_DIR/companies.json" ]; then
  cp /app/seed-data/companies.json "$DATA_DIR/companies.json"
fi

exec node server.js
