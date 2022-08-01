#!/bin/bash
set +e
source .env

set -e

psql --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" -h "$DB_HOST" -p "$PG_PORT" <<-EOSQL
  drop database if exists ${DB_NAME} with (force);
  do
  \$body\$
  declare
    num_users integer;
  begin
    SELECT count(*)
      into num_users
    FROM pg_user
    WHERE usename = '${DB_USER}';

    IF num_users = 0 THEN
        CREATE ROLE ${DB_USER} LOGIN PASSWORD '${DB_PASSWORD}';
    END IF;
  end
  \$body\$
  ;
  ALTER ROLE ${DB_USER} CREATEDB;
  CREATE DATABASE ${DB_NAME} WITH OWNER=${DB_USER};
  GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};
EOSQL

psql --username "$POSTGRES_USER" --dbname "$DB_NAME" -h "$DB_HOST" -p "$PG_PORT" <<-EOSQL
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
  create extension ltree;
  CREATE EXTENSION pg_trgm;
EOSQL
