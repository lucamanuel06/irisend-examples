// Exercise every delivery event in local dev without sending real mail.
//
// Irisend's sandbox provider (EMAIL_PROVIDER=log on a self-hosted instance, or any domain in
// your own dev/test team) recognizes magic recipient local-parts and simulates the matching
// event, so your webhook handlers and dashboards get real event traffic without a real send:
//
//   bounced@anything     -> email.bounced    (and the address is suppressed, like a real bounce)
//   delayed@anything     -> email.delivery_delayed
//   complained@anything  -> email.delivered, then email.complained
//   opened@anything      -> email.delivered, then email.opened
//   clicked@anything     -> email.delivered, then email.opened, then email.clicked
//   anything else        -> email.delivered only
//
// (Source: apps/worker/src/send-email.ts's simulateEvents() in the Irisend repo — this is what
// actually runs, not a separate "test mode" with different behavior.)
//
//   export IRISEND_API_KEY=ir_xxxxxxxx_xxxxxxxxxxxxxxxxxxxxxxxx
//   node send-sandbox.mjs

const apiKey = process.env.IRISEND_API_KEY;
if (!apiKey) throw new Error("Set IRISEND_API_KEY to your Irisend API key (ir_...)");
const apiUrl = process.env.IRISEND_API_URL ?? "https://api.irisend.com";

const scenarios = [
  { to: "delivered@example.com", label: "normal delivery" },
  { to: "bounced@example.com", label: "hard bounce + suppression" },
  { to: "delayed@example.com", label: "delivery delay" },
  { to: "complained@example.com", label: "spam complaint" },
  { to: "opened@example.com", label: "open tracking" },
  { to: "clicked@example.com", label: "click tracking" },
];

for (const { to, label } of scenarios) {
  const res = await fetch(`${apiUrl}/emails`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "test@yourdomain.com",
      to,
      subject: `Sandbox test — ${label}`,
      text: "Sandbox send, no real mail leaves the server.",
    }),
  });
  const body = await res.json();
  console.log(`${label.padEnd(26)} -> ${to.padEnd(24)} id=${body.id ?? JSON.stringify(body)}`);
}

console.log("\nCheck the matching webhook deliveries or /dev/inbox on your instance to see the events land.");
