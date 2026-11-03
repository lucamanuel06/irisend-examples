#!/usr/bin/env bash
# Send a transactional email with a single curl call.
#
# Set IRISEND_API_KEY to a key created in your dashboard (Settings > API Keys),
# or your own self-hosted/test instance's key.
#
#   export IRISEND_API_KEY=ir_xxxxxxxx_xxxxxxxxxxxxxxxxxxxxxxxx
#   export IRISEND_API_URL=https://api.irisend.com   # optional, this is the default
#   ./send-email.sh

set -euo pipefail

: "${IRISEND_API_KEY:?Set IRISEND_API_KEY to your Irisend API key (ir_...)}"
API_URL="${IRISEND_API_URL:-https://api.irisend.com}"

curl -sS -X POST "${API_URL}/emails" \
  -H "Authorization: Bearer ${IRISEND_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "onboarding@yourdomain.com",
    "to": "user@example.com",
    "subject": "Welcome!",
    "html": "<strong>It just works.</strong>",
    "text": "It just works."
  }'
echo
