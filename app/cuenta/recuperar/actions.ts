"use server";

import { randomBytes } from "crypto";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";

const TOKEN_TTL_MINUTES = 30;

async function getBaseUrl(): Promise<string> {
  const headerList = await headers();
  const host = headerList.get("host") ?? "localhost:3000";
  const protocol = host.startsWith("localhost") ? "http" : "https";
  return `${protocol}://${host}`;
}

export async function requestPasswordReset(formData: FormData): Promise<void> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();

  const client = email ? await prisma.client.findUnique({ where: { email } }) : null;

  // Ne jamais révéler si l'email existe ou non : même message dans tous les
  // cas, on n'envoie l'email que si un compte correspond vraiment.
  if (client) {
    const token = randomBytes(32).toString("hex");
    await prisma.passwordResetToken.create({
      data: {
        clientId: client.id,
        token,
        expiresAt: new Date(Date.now() + TOKEN_TTL_MINUTES * 60_000),
      },
    });

    const baseUrl = await getBaseUrl();
    const resetUrl = `${baseUrl}/cuenta/restablecer?token=${token}`;

    await sendPasswordResetEmail({ to: email, resetUrl }).catch(() => {
      // Ne bloque pas l'utilisateur si l'envoi échoue : même message générique.
    });
  }

  redirect("/cuenta/recuperar?enviado=1");
}
