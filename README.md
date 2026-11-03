# Irisend examples

Runnable, minimal examples for the [Irisend](https://irisend.com) API — a transactional and
marketing email API built on Amazon SES, with a request/response contract matched to
[Resend's](https://resend.com), so most existing Resend integrations only need a different base
URL.

- Docs & full API reference: **<https://irisend.com/docs>**
- Migrating from Resend: **<https://irisend.com/docs/migrating-from-resend>**
- Join the waitlist (pre-launch, invite-only): **<https://irisend.com/waitlist>**

This repo has no build step and no shared dependencies between examples — each directory is
self-contained; read its own comments and run it on its own.

## Examples

| Directory | What it shows |
|---|---|
| [`curl/`](./curl) | Sending an email with a single `curl` call — no SDK, no dependencies. |
| [`node-fetch/`](./node-fetch) | Sending with nothing but Node's global `fetch` (Node ≥ 22). |
| [`node-resend-sdk/`](./node-resend-sdk) | Using the official [`resend`](https://www.npmjs.com/package/resend) npm package pointed at Irisend via `baseUrl` (or `RESEND_BASE_URL`) — proof that existing Resend code works unmodified. |
| [`nodemailer-smtp/`](./nodemailer-smtp) | Sending over Irisend's SMTP relay (`smtp.irisend.com:465`/`587`) with [Nodemailer](https://nodemailer.com) — useful for anything that already speaks SMTP. |
| [`nextjs-route-handler/`](./nextjs-route-handler) | A Next.js (App Router) Route Handler that sends server-side, keeping the API key off the client. |
| [`python-requests/`](./python-requests) | Sending with plain [`requests`](https://pypi.org/project/requests/) — no SDK required. |
| [`webhook-verification/`](./webhook-verification) | Verifying an inbound webhook's signature with the [`svix`](https://www.npmjs.com/package/svix) library (Irisend's signatures are [Standard Webhooks](https://www.standardwebhooks.com)-compliant and byte-compatible with Svix). |
| [`idempotency-key/`](./idempotency-key) | Using `Idempotency-Key` to make a retried send safe — no duplicate email on a retry. |
| [`sandbox-magic-addresses/`](./sandbox-magic-addresses) | Exercising every delivery event (bounce, delay, complaint, open, click) in a sandbox/dev instance without sending real mail, via magic recipient addresses. |

## Authentication

Every REST example needs an API key from your Irisend dashboard (**Settings → API Keys**),
passed as a Bearer token:

```
Authorization: Bearer ir_xxxxxxxx_xxxxxxxxxxxxxxxxxxxxxxxx
```

The SMTP example instead uses the literal username `irisend` (or `resend`, accepted as a
drop-in-migration alias) with the same API key as the password.

Set it once per shell:

```sh
export IRISEND_API_KEY=ir_xxxxxxxx_xxxxxxxxxxxxxxxxxxxxxxxx
```

`IRISEND_API_URL` defaults to `https://api.irisend.com` — override it to point any example at a
self-hosted/test instance instead (e.g. `http://localhost:3001`).

## Topics

`email-api` · `resend-alternative` · `transactional-email` · `aws-ses` · `smtp` · `nodejs` ·
`nextjs` · `self-hosted`

## License

[MIT](./LICENSE)
