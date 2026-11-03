// Irisend's /emails endpoint matches Resend's request/response shape, so the official `resend`
// Node SDK works against Irisend unmodified — just point it at a different base URL. The SDK
// reads `baseUrl` from its constructor options, or the `RESEND_BASE_URL` env var if you'd rather
// not touch code when migrating (see https://github.com/resend/resend-node/blob/main/src/resend.ts).
//
//   npm install resend
//   export IRISEND_API_KEY=ir_xxxxxxxx_xxxxxxxxxxxxxxxxxxxxxxxx
//   node send-email.mjs
//
// Equivalent env-var-only version (no code change from a real Resend integration):
//   export RESEND_API_KEY=$IRISEND_API_KEY
//   export RESEND_BASE_URL=https://api.irisend.com
//   node send-email.mjs   # then just `new Resend()` with no baseUrl option

import { Resend } from "resend";

const apiKey = process.env.IRISEND_API_KEY;
if (!apiKey) throw new Error("Set IRISEND_API_KEY to your Irisend API key (ir_...)");

const resend = new Resend(apiKey, {
  baseUrl: process.env.IRISEND_API_URL ?? "https://api.irisend.com",
});

const { data, error } = await resend.emails.send({
  from: "onboarding@yourdomain.com",
  to: "user@example.com",
  subject: "Welcome!",
  html: "<strong>It just works.</strong>",
});

if (error) {
  console.error(error.name, error.statusCode, error.message);
  process.exitCode = 1;
} else {
  console.log("sent", data.id);
}
