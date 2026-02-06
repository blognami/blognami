#!/bin/bash
set -e

# Split args on "--": left side = extra docker flags, right side = container command
DOCKER_FLAGS=()
COMMAND=()
while [[ $# -gt 0 ]]; do
  case "$1" in
    --) shift; COMMAND=("$@"); break ;;
    *)  DOCKER_FLAGS+=("$1"); shift ;;
  esac
done

npm run --silent ralph:docker:build

exec docker run --rm --shm-size=1g \
  -v "$(pwd)":/app \
  -v blognami-ralph-nm:/app/node_modules \
  -e CLAUDE_CODE_OAUTH_TOKEN \
  -e ANTHROPIC_API_KEY \
  -e DOCKER=1 \
  "${DOCKER_FLAGS[@]}" \
  blognami-ralph \
  "${COMMAND[@]}"
