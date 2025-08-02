#!/usr/bin/env bash
# Usage: ./up.sh [-d]  (passes all args on to 'docker compose up')

set -a               # auto-export env vars
source .env 2>/dev/null || true  # load .env into shell (ignore if missing)
set +a

# Auto-enable tunnel profile if a token is present
if [[ -n "${TUNNEL_TOKEN}" ]]; then
  export COMPOSE_PROFILES="${COMPOSE_PROFILES:-} tunnel"
  echo "🚇 Cloudflare Tunnel detected - enabling tunnel profile"
else
  echo "🏠 Running in local-only mode"
fi

echo "🚀 Starting GPU Dashboard..."
exec docker compose up "$@"