#!/bin/bash
set -e

source .env

PGPASSWORD="$DB_PASSWORD" psql -U ${DB_USER} -d ${DB_NAME} -h ${DB_HOST} -p $PG_PORT -f dev/drop-tables.sql
PGPASSWORD="$DB_PASSWORD" psql -U ${DB_USER} -d ${DB_NAME} -h ${DB_HOST} -p $PG_PORT -f schema/schema.sql