// Safe retries with Idempotency-Key.
//
// POST /emails and POST /emails/batch accept an `Idempotency-Key` header (1-256 chars, any
// string you pick — an order id, a job id, anything unique to this logical send). Irisend hashes
// the normalized request body and remembers it for 24h:
//
//   - same key, same body        -> returns the ORIGINAL email, no new send (safe retry)
//   - same key, different body   -> 409 invalid_idempotent_request (you reused a key for a
//                                    different request — that's almost always a bug)
//   - same key, two requests truly in flight at once -> 409 concurrent_idempotent_requests
//
// This example sends the same request twice with the same key and shows you get the same id
// back both times — no duplicate email.
//
//   export IRISEND_API_KEY=ir_xxxxxxxx_xxxxxxxxxxxxxxxxxxxxxxxx
//   node send-with-idempotency.mjs

const apiKey = process.env.IRISEND_API_KEY;
if (!apiKey) throw new Error("Set IRISEND_API_KEY to your Irisend API key (ir_...)");
const apiUrl = process.env.IRISEND_API_URL ?? "https://api.irisend.com";

// Pick a key that's stable for *this* logical send — e.g. derived from your own order/job id,
// not a fresh uuid per attempt (a fresh uuid per attempt defeats the point: dedupe won't find it).
const idempotencyKey = `order-42-confirmation`;

async function send() {
  const res = await fetch(`${apiUrl}/emails`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify({
      from: "onboarding@yourdomain.com",
      to: "user@example.com",
      subject: "Your order is confirmed",
      html: "<p>Order #42 confirmed.</p>",
    }),
  });
  return { status: res.status, body: await res.json() };
}

const first = await send();
console.log("first attempt: ", first.status, first.body);

const retry = await send(); // simulates a client retrying after a timeout
console.log("retried send:  ", retry.status, retry.body);

if (first.body.id !== retry.body.id) {
  throw new Error("expected the same email id on both attempts — idempotency did not dedupe");
}
console.log("same email id both times — no duplicate send:", first.body.id);
