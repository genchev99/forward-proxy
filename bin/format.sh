#!/usr/bin/env bash

source "$( dirname "$( realpath "${BASH_SOURCE[0]}" )" )/helpers.sh"

print "Formatting code" "info"
run_me_in_container app "${@}"

eslint --fix src/**/*.js
