import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { CLIENT_COOKIE_NAME, getClientIdFromSession } from "@/lib/clientSession";

export async function getCurrentClient() {
  const cookieStore = await cookies();
  const clientId = getClientIdFromSession(cookieStore.get(CLIENT_COOKIE_NAME)?.value);
  if (!clientId) return null;

  return prisma.client.findUnique({ where: { id: clientId } });
}
