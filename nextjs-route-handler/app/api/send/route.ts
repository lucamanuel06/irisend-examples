// app/api/send/route.ts
//
// A Next.js (App Router) Route Handler that sends through Irisend server-side, so the API key
// never reaches the browser. Written against Next.js 16's Route Handler conventions (plain Web
// Request/Response, no next/server wrapper required) — see
// https://nextjs.org/docs/app/api-reference/file-conventions/route.
//
// Env: IRISEND_API_KEY=ir_xxxxxxxx_xxxxxxxxxxxxxxxxxxxxxxxx (server-only, never NEXT_PUBLIC_*)

import type { NextRequest } from "next/server";

const API_URL = process.env.IRISEND_API_URL ?? "https://api.irisend.com";

interface SendRequestBody {
  to: string;
  subject: string;
  html: string;
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.IRISEND_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "IRISEND_API_KEY is not configured" }, { status: 500 });
  }

  const body = (await request.json()) as SendRequestBody;
  if (!body.to || !body.subject || !body.html) {
    return Response.json({ error: "to, subject, and html are required" }, { status: 400 });
  }

  const res = await fetch(`${API_URL}/emails`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": crypto.randomUUID(),
    },
    body: JSON.stringify({
      from: "onboarding@yourdomain.com",
      to: body.to,
      subject: body.subject,
      html: body.html,
    }),
  });

  const data = await res.json();
  // Pass the exact status + error shape through — { name, message, statusCode } on failure.
  return Response.json(data, { status: res.status });
}
