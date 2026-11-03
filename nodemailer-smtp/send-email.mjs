// Send through Irisend's SMTP relay instead of the REST API — useful for anything that already
// speaks SMTP (mailing-list software, legacy app code, etc.). The relay runs the exact same send
// pipeline and quota checks as POST /emails: domain verification, suppressions, and rate limits
// are identical regardless of which transport you use.
//
// Username is always the literal string "irisend" (or "resend", accepted as a drop-in-migration
// alias so an existing Resend SMTP config only needs its host changed). Password is an Irisend
// API key — the same key you'd use as a Bearer token on the REST API.
//
//   npm install nodemailer
//   export IRISEND_API_KEY=ir_xxxxxxxx_xxxxxxxxxxxxxxxxxxxxxxxx
//   node send-email.mjs

import nodemailer from "nodemailer";

const apiKey = process.env.IRISEND_API_KEY;
if (!apiKey) throw new Error("Set IRISEND_API_KEY to your Irisend API key (ir_...)");

// STARTTLS on 587 (most common). For implicit TLS on 465 instead, use port: 465, secure: true.
const transport = nodemailer.createTransport({
  host: process.env.IRISEND_SMTP_HOST ?? "smtp.irisend.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: "irisend",
    pass: apiKey,
  },
});

const info = await transport.sendMail({
  from: "onboarding@yourdomain.com",
  to: "user@example.com",
  subject: "Welcome!",
  html: "<strong>It just works.</strong>",
  text: "It just works.",
});

console.log("sent", info.response);
