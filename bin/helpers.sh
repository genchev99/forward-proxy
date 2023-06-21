#!/usr/bin/env bash

# prints colored text
print () {
    if [ "${2}" == "info" ] ; then
        COLOR="96m";
    elif [ "${2}" == "success" ] ; then
        COLOR="92m";
    elif [ "${2}" == "warning" ] ; then
        COLOR="93m";
    elif [ "${2}" == "danger" ] ; then
        COLOR="91m";
    else #default color
        COLOR="96m";
    fi

    STARTCOLOR="\e[$COLOR";
    ENDCOLOR="\e[0m";

    printf "$STARTCOLOR%b$ENDCOLOR" "${1}\n";
}

# Variables
export PROJECT_ROOT_DIR=$( dirname "$( dirname "$( realpath "${BASH_SOURCE[0]}" )" )" )
export BIN_DIR="${PROJECT_ROOT_DIR}/bin"

cd "${PROJECT_ROOT_DIR}" || exit

# Docker compose tools
function is_in_container() {
  if [ -f /.dockerenv ]; then
    return 0
  else
    return 1
  fi
}


function run_me_in_container() {
  if is_in_container; then
    # If the script is already getting executed inside the container we don't need to do anything
    print "Already in container" "warning"
    return 0
  fi

  # Otherwise, we want to run the script inside the container
  local service="${1}"
  local bin_name="$(basename "${0}")"
  shift  # Remove the bin name from the args

  docker-compose run --rm --entrypoint "/app/bin/${bin_name}" "${service}" "${@}"
  exit
}

function exec_me_in_container() {
  if is_in_container; then
    # If the script is already getting executed inside the container we don't need to do anything
    print "Already in container" "warning"
    return 0
  fi

  # Otherwise, we want to run the script inside the container
  local service="${1}"
  local bin_name="$(basename "${0}")"
  shift  # Remove the bin name from the args

  docker-compose exec "${service}" "/app/bin/${bin_name}" "${@}"
  exit
}

function run_in_container() {
  if is_in_container; then
    # If the script is already getting executed inside the container we don't need to do anything
    print "Already in container" "warning"
    return 0
  fi

  # Otherwise, we want to run the script inside the container
  local service="${1}"
  shift  # Remove the bin name from the args

  docker-compose run --rm "${service}" "${@}"
  exit
}
