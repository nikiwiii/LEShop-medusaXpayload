#!/bin/bash
# Creates the Payload CMS database alongside the Medusa database
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    SELECT 'CREATE DATABASE payload_db'
    WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'payload_db')\gexec
EOSQL
