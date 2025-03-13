#!/bin/bash
set -e

# Create the additional test database
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
  CREATE DATABASE "$POSTGRES_TEST_DB";
EOSQL