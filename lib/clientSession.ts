import { createHmac, timingSafeEqual } from "crypto";

const COOKIE_NAME = "trenzame_client_session";

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET n'est pas défini (voir .env.example).");
  }
  return secret;
}

function sign(value: string): string {
  return createHmac("sha256", getSecret()).update(value).digest("hex");
}

export function createClientSessionCookieValue(clientId: string): string {
  return `${clientId}.${sign(clientId)}`;
}

export function getClientIdFromSession(cookieValue: string | undefined): string | null {
  if (!cookieValue) return null;
  const separatorIndex = cookieValue.lastIndexOf(".");
  if (separatorIndex === -1) return null;

  const clientId = cookieValue.slice(0, separatorIndex);
  const signature = cookieValue.slice(separatorIndex + 1);
  if (!clientId || !/^[0-9a-f]{64}$/.test(signature)) return null;

  const expectedBuf = Buffer.from(sign(clientId), "hex");
  const actualBuf = Buffer.from(signature, "hex");
  if (expectedBuf.length !== actualBuf.length || !timingSafeEqual(expectedBuf, actualBuf)) {
    return null;
  }

  return clientId;
}

export { COOKIE_NAME as CLIENT_COOKIE_NAME };
