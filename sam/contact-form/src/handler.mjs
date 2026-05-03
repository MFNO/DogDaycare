import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

function base64ToUtf8(b64) {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

const ses = new SESClient({});

function json(statusCode, body) {
  const origin = process.env.ALLOWED_ORIGIN || "*";
  return {
    statusCode,
    headers: {
      "content-type": "application/json",
      "access-control-allow-origin": origin,
    },
    body: JSON.stringify(body),
  };
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function stringifyFieldValue(value) {
  if (value === null || value === undefined) return "";
  if (typeof value === "object") {
    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return String(value);
    }
  }
  return String(value);
}

/** Turns parsed JSON into a plain object of stringifiable fields. */
function asFieldObject(parsed) {
  if (parsed !== null && typeof parsed === "object" && !Array.isArray(parsed)) {
    return parsed;
  }
  return {
    submission:
      typeof parsed === "string" ? parsed : JSON.stringify(parsed),
  };
}

function validateContactPayload(parsed) {
  if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
    return { ok: false, error: "Invalid payload" };
  }

  const name = typeof parsed.name === "string" ? parsed.name.trim() : "";
  const email = typeof parsed.email === "string" ? parsed.email.trim() : "";
  const phone = typeof parsed.phone === "string" ? parsed.phone.trim() : "";
  const message =
    typeof parsed.message === "string" ? parsed.message.trim() : "";

  if (!name || name.length > 200) {
    return { ok: false, error: "Invalid name" };
  }
  if (!email || email.length > 320) {
    return { ok: false, error: "Invalid email" };
  }
  const phoneDigits = phone.replace(/\D/g, "");
  if (!phone || phone.length > 40 || phoneDigits.length < 10) {
    return { ok: false, error: "Invalid phone number" };
  }
  if (!message || message.length > 10000) {
    return { ok: false, error: "Invalid message" };
  }

  return { ok: true };
}

function buildMessageBodies(rawBody) {
  let parsed;
  try {
    parsed = JSON.parse(rawBody.trim() === "" ? "{}" : rawBody);
  } catch {
    return {
      Text: { Data: rawBody, Charset: "UTF-8" },
    };
  }

  const fields = asFieldObject(parsed);
  const entries = Object.entries(fields);

  const intro =
    "Someone left a message through the contact form — fetch the treats, good mail arrived.";
  const outro =
    "Tail wags and typed paws,\nYour contact-form helper";

  const htmlChunks = [
    "<!DOCTYPE html><html><head><meta charset=\"UTF-8\"></head>",
    '<body style="font-family: system-ui, sans-serif; color: #2d2d2d; line-height: 1.5; max-width: 560px;">',
    `<p style="margin: 0 0 1.25rem;">${escapeHtml(intro)}</p>`,
  ];

  const textLines = [intro, ""];

  for (const [key, value] of entries) {
    const val = stringifyFieldValue(value);
    htmlChunks.push(
      '<div style="margin-bottom: 1.15rem;">',
      `<strong>${escapeHtml(key)}</strong>`,
      `<div style="margin-top: 0.3rem; white-space: pre-wrap;">${escapeHtml(val)}</div>`,
      "</div>",
    );
    textLines.push(key);
    textLines.push(val);
    textLines.push("");
  }

  htmlChunks.push(
    `<p style="margin: 1.25rem 0 0; font-size: 0.9rem; color: #666;">Tail wags and typed paws,<br/>Your contact-form helper</p>`,
    "</body></html>",
  );

  textLines.push(outro);

  return {
    Text: { Data: textLines.join("\n"), Charset: "UTF-8" },
    Html: {
      Data: htmlChunks.join(""),
      Charset: "UTF-8",
    },
  };
}

export async function handler(event) {
  if (event.requestContext?.http?.method === "OPTIONS") {
    const origin = process.env.ALLOWED_ORIGIN || "*";
    return {
      statusCode: 204,
      headers: { "access-control-allow-origin": origin },
      body: "",
    };
  }

  const raw =
    event.body == null
      ? ""
      : event.isBase64Encoded
        ? base64ToUtf8(event.body)
        : event.body;

  let parsedBody;
  try {
    parsedBody = JSON.parse(raw.trim() === "" ? "{}" : raw);
  } catch {
    return json(400, { error: "Invalid JSON" });
  }

  const validation = validateContactPayload(parsedBody);
  if (!validation.ok) {
    return json(400, { error: validation.error });
  }

  const to = process.env.DESTINATION_EMAIL;
  const from = process.env.SOURCE_EMAIL;
  if (!to || !from) {
    console.error("Missing DESTINATION_EMAIL or SOURCE_EMAIL");
    return json(500, { error: "Server configuration error" });
  }

  try {
    await ses.send(
      new SendEmailCommand({
        Source: from,
        Destination: { ToAddresses: [to] },
        Message: {
          Subject: { Data: "Contact form", Charset: "UTF-8" },
          Body: buildMessageBodies(raw),
        },
      }),
    );
  } catch (err) {
    console.error(err);
    return json(502, { error: "Could not send email" });
  }

  return json(200, { ok: true });
}
