// Send a transactional email with nothing but global fetch — no SDK, no dependencies.
// Requires Node >= 22 (global fetch).
//
//   export IRISEND_API_KEY=ir_xxxxxxxx_xxxxxxxxxxxxxxxxxxxxxxxx
//   export IRISEND_API_URL=https://api.irisend.com   # optional, this is the default
//   node send-email.mjs

const apiKey = process.env.IRISEND_API_KEY;
if (!apiKey) throw new Error("Set IRISEND_API_KEY to your Irisend API key (ir_...)");
const apiUrl = process.env.IRISEND_API_URL ?? "https://api.irisend.com";

const res = await fetch(`${apiUrl}/emails`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
    // Idempotency-Key makes a retried request safe — see ../idempotency-key for more.
    "Idempotency-Key": `welcome-email-${crypto.randomUUID()}`,
  },
  body: JSON.stringify({
    from: "onboarding@yourdomain.com",
    to: "user@example.com",
    subject: "Welcome!",
    html: "<strong>It just works.</strong>",
    text: "It just works.",
  }),
});

const body = await res.json();
if (!res.ok) {
  // Irisend's error shape (matching Resend's): { name, message, statusCode }.
  throw new Error(`send failed: ${res.status} ${body.name} — ${body.message}`);
}

console.log("sent", body.id);
