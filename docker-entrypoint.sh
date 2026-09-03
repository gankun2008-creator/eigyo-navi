#!/bin/sh
set -eu

mkdir -p "$DATA_DIR"
if [ ! -f "$DATA_DIR/companies.sqlite" ]; then
  cp /app/seed-data/companies.sqlite "$DATA_DIR/companies.sqlite"
fi
# The company catalogue is generated application data, not user-created data.
# Refresh it on every image update so an existing Docker volume cannot keep an
# older schema and silently turn all search results into zero records.
cp /app/seed-data/companies.json "$DATA_DIR/companies.json"

exec node server.js
