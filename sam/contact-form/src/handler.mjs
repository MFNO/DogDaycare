import { SESClient, SendEmailCommand, SendRawEmailCommand } from "@aws-sdk/client-ses";

function base64ToUtf8(b64) {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

const ses = new SESClient({});

const CONTRACT_MAX_BYTES = 5 * 1024 * 1024;
const DOCX_MIME =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

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

const EMAIL_BODY_SKIP_KEYS = new Set(["contractBase64"]);

function normalizeBase64(s) {
  if (typeof s !== "string") return "";
  const t = s.trim();
  const dataUrl = /^data:[^;]+;base64,(.+)$/is.exec(t);
  return (dataUrl ? dataUrl[1] : t).replace(/\s/g, "");
}

/** @returns {{ ok: true, attachment: null | { fileName: string, bytes: Buffer } } | { ok: false, error: string }}} */
function validateContract(parsed) {
  const fileName =
    typeof parsed.contractFileName === "string"
      ? parsed.contractFileName.trim()
      : "";
  const b64Raw =
    typeof parsed.contractBase64 === "string"
      ? normalizeBase64(parsed.contractBase64)
      : "";
  const hasAny = fileName.length > 0 || b64Raw.length > 0;
  if (!hasAny) return { ok: true, attachment: null };
  if (!fileName || !b64Raw) {
    return { ok: false, error: "Contract file upload is incomplete" };
  }
  if (fileName.length > 255) {
    return { ok: false, error: "Invalid contract file name" };
  }
  const lower = fileName.toLowerCase();
  if (!lower.endsWith(".docx")) {
    return { ok: false, error: "Contract must be a .docx file" };
  }
  let bytes;
  try {
    bytes = Buffer.from(b64Raw, "base64");
  } catch {
    return { ok: false, error: "Invalid contract file data" };
  }
  if (bytes.length === 0 || bytes.length > CONTRACT_MAX_BYTES) {
    return { ok: false, error: "Contract file is too large (max 5 MB)" };
  }
  // .docx is a ZIP archive
  if (bytes[0] !== 0x50 || bytes[1] !== 0x4b) {
    return { ok: false, error: "Contract file does not look like a valid .docx" };
  }
  return { ok: true, attachment: { fileName, bytes } };
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

  const contractCheck = validateContract(parsed);
  if (!contractCheck.ok) return contractCheck;

  return { ok: true, attachment: contractCheck.attachment };
}

function foldBase64(b64) {
  const cleaned = b64.replace(/\s/g, "");
  const lines = [];
  for (let i = 0; i < cleaned.length; i += 76) {
    lines.push(cleaned.slice(i, i + 76));
  }
  return lines.join("\r\n");
}

function encodeAttachmentFilename(filename) {
  if (/^[\x20-\x7E]*$/.test(filename) && !/["\\\r\n]/.test(filename)) {
    return `filename="${filename.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
  }
  return `filename*=UTF-8''${encodeURIComponent(filename)}`;
}

/**
 * @param {{ text: string, html: string }} bodies
 * @param {{ fileName: string, bytes: Buffer }} attachment
 */
function buildRawMime({ from, to, subject, bodies, attachment }) {
  const mixed = `mixed_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  const alt = `alt_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  const nl = "\r\n";

  const textB64 = foldBase64(Buffer.from(bodies.text, "utf8").toString("base64"));
  const htmlB64 = foldBase64(Buffer.from(bodies.html, "utf8").toString("base64"));
  const attachB64 = foldBase64(attachment.bytes.toString("base64"));

  const parts = [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${subject}`,
    `MIME-Version: 1.0`,
    `Content-Type: multipart/mixed; boundary="${mixed}"`,
    ``,
    `--${mixed}`,
    `Content-Type: multipart/alternative; boundary="${alt}"`,
    ``,
    `--${alt}`,
    `Content-Type: text/plain; charset=UTF-8`,
    `Content-Transfer-Encoding: base64`,
    ``,
    textB64,
    `--${alt}`,
    `Content-Type: text/html; charset=UTF-8`,
    `Content-Transfer-Encoding: base64`,
    ``,
    htmlB64,
    `--${alt}--`,
    ``,
    `--${mixed}`,
    `Content-Type: ${DOCX_MIME}`,
    `Content-Transfer-Encoding: base64`,
    `Content-Disposition: attachment; ${encodeAttachmentFilename(attachment.fileName)}`,
    ``,
    attachB64,
    `--${mixed}--`,
    ``,
  ];

  return parts.join(nl);
}

function buildEmailBodies(parsed) {
  const fields = asFieldObject(parsed);
  const entries = Object.entries(fields).filter(
    ([key]) => !EMAIL_BODY_SKIP_KEYS.has(key),
  );

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
    text: textLines.join("\n"),
    html: htmlChunks.join(""),
  };
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

  const bodies = buildEmailBodies(parsed);
  return {
    Text: { Data: bodies.text, Charset: "UTF-8" },
    Html: {
      Data: bodies.html,
      Charset: "UTF-8",
    },
  };
}

export async function handler(event) {
  if (event.requestContext?.http?.method === "OPTIONS") {
    const origin = process.env.ALLOWED_ORIGIN || "*";
    return {
      statusCode: 204,
      headers: {
        "access-control-allow-origin": origin,
        "access-control-allow-methods": "POST,OPTIONS",
        "access-control-allow-headers": "content-type",
      },
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

  const attachment = validation.attachment;

  try {
    if (attachment) {
      const bodies = buildEmailBodies(parsedBody);
      const mime = buildRawMime({
        from,
        to,
        subject: "Contact form (signed contract attached)",
        bodies,
        attachment,
      });
      await ses.send(
        new SendRawEmailCommand({
          Source: from,
          Destinations: [to],
          RawMessage: { Data: Buffer.from(mime, "utf8") },
        }),
      );
    } else {
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
    }
  } catch (err) {
    console.error(err);
    return json(502, { error: "Could not send email" });
  }

  return json(200, { ok: true });
}
