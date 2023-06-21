#!/usr/bin/env bash

source "$( dirname "$( realpath "${BASH_SOURCE[0]}" )" )/bin/helpers.sh"

# This file contains integration tests using the proxy server.

PROXY="http://localhost:3000"
ECHO_SERVER="https://postman-echo.com"

function assert() {
  if [ "$1" != "$2" ]; then
    echo "Expected '$1' to equal '$2'"
    exit 1
  fi

  echo "OK ✅"
}

print "Tests without proxy (directly from host)" "warning"
print "GET Public IP: $(curl --fail -s "https://ifconfig.io/ip")" "danger"
print "GET Echo query args: $(curl --fail -s "${ECHO_SERVER}/get?foo=bar" | jq '.args')" "danger"
print "POST Echo form data args: $(curl --fail -s -X POST -d "foo=bar" "${ECHO_SERVER}/post" | jq -r '.form')" "danger"
printf "\n"
print "Tests with proxy" "warning"
print "GET Public IP: $(curl --fail -s --proxy "${PROXY}" "https://ifconfig.io/ip")" "danger"
print "GET Echo query args: $(curl --fail -s --proxy "${PROXY}" "${ECHO_SERVER}/get?foo=bar"  | jq '.args')" "danger"
print "POST Echo form data args: $(curl --fail -s -X POST -d "foo=bar" --proxy "${PROXY}" "${ECHO_SERVER}/post" | jq -r '.form')" "danger"
