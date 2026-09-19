import { createHmac, timingSafeEqual } from "crypto";

const COOKIE_NAME = "trenzame_admin_session";

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

// Le cookie encode l'id du professionnel connecté (comme lib/clientSession.ts
// pour les clientes) : chaque professionnel n'accède qu'à ses propres
// données, au lieu de toujours retomber sur le professionnel par défaut.
export function createSessionCookieValue(professionalId: string): string {
  return `${professionalId}.${sign(professionalId)}`;
}

export function getProfessionalIdFromSession(cookieValue: string | undefined): string | null {
  if (!cookieValue) return null;
  const separatorIndex = cookieValue.lastIndexOf(".");
  if (separatorIndex === -1) return null;

  const professionalId = cookieValue.slice(0, separatorIndex);
  const signature = cookieValue.slice(separatorIndex + 1);
  if (!professionalId || !/^[0-9a-f]{64}$/.test(signature)) return null;

  const expectedBuf = Buffer.from(sign(professionalId), "hex");
  const actualBuf = Buffer.from(signature, "hex");
  if (expectedBuf.length !== actualBuf.length || !timingSafeEqual(expectedBuf, actualBuf)) {
    return null;
  }

  return professionalId;
}

export { COOKIE_NAME };
