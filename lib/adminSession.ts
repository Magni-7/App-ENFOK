import { createHmac, timingSafeEqual } from "crypto";

const COOKIE_NAME = "eva_admin_session";
const SESSION_VALUE = "ok";

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

export function createSessionCookieValue(): string {
  const signature = sign(SESSION_VALUE);
  return `${SESSION_VALUE}.${signature}`;
}

const HEX_SIGNATURE_RE = /^[0-9a-f]{64}$/;

export function isValidSessionCookieValue(cookieValue: string | undefined): boolean {
  if (!cookieValue) return false;
  const [value, signature] = cookieValue.split(".");
  if (!value || !signature) return false;
  if (value !== SESSION_VALUE) return false;
  if (!HEX_SIGNATURE_RE.test(signature)) return false;

  const expectedBuf = Buffer.from(sign(value), "hex");
  const actualBuf = Buffer.from(signature, "hex");

  return timingSafeEqual(expectedBuf, actualBuf);
}

export { COOKIE_NAME };
