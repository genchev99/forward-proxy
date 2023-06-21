#!/usr/bin/env bash

# Copy the env.template to .env.${environment} for envronments = [local, testing (add if needed)]
for environment in local; do
  cp env.template ".env.${environment}"
  # TODO: Update if env.template contains any secrets
done
