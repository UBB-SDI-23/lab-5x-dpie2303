#!/bin/sh

if [ -d "sql_scripts" ]; then
    cp -r sql_scripts/ /app/sql_scripts/
fi