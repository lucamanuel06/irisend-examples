// Verify an inbound Irisend webhook signature with the `svix` library.
//
// Irisend signs every webhook delivery with the Standard Webhooks spec
// (https://www.standardwebhooks.com) — HMAC-SHA256 over `{id}.{timestamp}.{body}`, formatted as
// `v1,<base64>` — and sends both the spec's own header names (webhook-id/webhook-timestamp/
// webhook-signature) and Svix's aliases (svix-id/svix-timestamp/svix-signature) on every
// request, so either the `svix` package or any `standardwebhooks`-spec library verifies it
// unchanged. This mirrors exactly what the server does in packages/core/src/webhooks.ts.
//
//   npm install svix
//   node verify.mjs
//
// In a real HTTP handler, `headers` comes from the incoming request and `payload` must be the
// *raw* request body string (not a re-stringified parsed object — the signature is sensitive to
// exact bytes). This file hand-builds a sample request to demonstrate verify() succeeding and
// failing, with no network calls.

import { Webhook } from "svix";

// The signing secret is shown once when you create a webhook endpoint
// (POST /webhooks -> { signing_secret: "whsec_..." }); store it, Irisend doesn't show it again.
const secret = "whsec_MfKQ9r8GKYqrTwjUPD8ILPZIo2LaLaSw";

const payload = JSON.stringify({
  type: "email.delivered",
  created_at: "2026-09-25T09:01:04.112Z",
  data: {
    email_id: "em_9f2K3mQ1zPr7vT6yB4wL0nC",
    from: "hello@yourdomain.com",
    to: ["you@example.com"],
    subject: "Your receipt",
    created_at: "2026-09-25T09:00:12.481Z",
    tags: { category: "receipt" },
  },
});

// Sign it ourselves here only to produce a realistic example payload+headers pair; in your own
// webhook endpoint, these three values come straight off the inbound request's headers.
const id = `msg_${crypto.randomUUID()}`;
const timestamp = Math.floor(Date.now() / 1000);
const wh = new Webhook(secret);
const signature = wh.sign(id, new Date(timestamp * 1000), payload);

const headers = {
  "svix-id": id,
  "svix-timestamp": String(timestamp),
  "svix-signature": signature,
};

try {
  // verify() returns void and throws on a bad signature — it does not parse the body for you,
  // so parse it yourself once verification has passed.
  wh.verify(payload, headers);
  const event = JSON.parse(payload);
  console.log("verified:", event.type, event.data.email_id);
} catch (err) {
  console.error("signature verification failed:", err.message);
  process.exitCode = 1;
}
