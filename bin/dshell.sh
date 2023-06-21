#!/usr/bin/env bash

source "$( dirname "$( realpath "${BASH_SOURCE[0]}" )" )/helpers.sh"

docker-compose run --rm --entrypoint bash "${1:-app}"
