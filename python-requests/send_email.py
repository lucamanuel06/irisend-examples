#!/usr/bin/env python3
"""Send a transactional email with plain `requests` — no SDK required.

    pip install requests
    export IRISEND_API_KEY=ir_xxxxxxxx_xxxxxxxxxxxxxxxxxxxxxxxx
    python3 send_email.py

(Irisend also ships an official Python SDK — see https://irisend.com/docs#sdk-python — this
example is for anyone who'd rather not add a dependency.)
"""
import os
import sys
import uuid

import requests

API_KEY = os.environ.get("IRISEND_API_KEY")
if not API_KEY:
    sys.exit("Set IRISEND_API_KEY to your Irisend API key (ir_...)")

API_URL = os.environ.get("IRISEND_API_URL", "https://api.irisend.com")

response = requests.post(
    f"{API_URL}/emails",
    headers={
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json",
        # Makes a retried request safe — see ../idempotency-key for more.
        "Idempotency-Key": f"welcome-email-{uuid.uuid4()}",
    },
    json={
        "from": "onboarding@yourdomain.com",
        "to": "user@example.com",
        "subject": "Welcome!",
        "html": "<strong>It just works.</strong>",
        "text": "It just works.",
    },
    timeout=15,
)

body = response.json()
if not response.ok:
    # Irisend's error shape (matching Resend's): {"name": ..., "message": ..., "statusCode": ...}
    sys.exit(f"send failed: {response.status_code} {body['name']} — {body['message']}")

print("sent", body["id"])
