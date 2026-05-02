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
          Body: {
            Text: { Data: raw, Charset: "UTF-8" },
          },
        },
      }),
    );
  } catch (err) {
    console.error(err);
    return json(502, { error: "Could not send email" });
  }

  return json(200, { ok: true });
}
