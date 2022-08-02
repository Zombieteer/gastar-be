#!/bin/bash
set -e

source .env

PGPASSWORD="$DB_PASSWORD" psql -U ${DB_USER} -d ${DB_NAME} -h ${DB_HOST} -p $PG_PORT -f sql/dev/drop-tables.sql
PGPASSWORD="$DB_PASSWORD" psql -U ${DB_USER} -d ${DB_NAME} -h ${DB_HOST} -p $PG_PORT -f sql/schema/schema.sql
PGPASSWORD="$DB_PASSWORD" psql -U ${DB_USER} -d ${DB_NAME} -h ${DB_HOST} -p $PG_PORT -f sql/schema/populate.sql