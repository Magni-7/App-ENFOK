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

export async function requestProfessionalPasswordReset(formData: FormData): Promise<void> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();

  const professional = email ? await prisma.professional.findUnique({ where: { email } }) : null;

  if (professional) {
    const token = randomBytes(32).toString("hex");
    await prisma.professionalPasswordResetToken.create({
      data: {
        professionalId: professional.id,
        token,
        expiresAt: new Date(Date.now() + TOKEN_TTL_MINUTES * 60_000),
      },
    });

    const baseUrl = await getBaseUrl();
    const resetUrl = `${baseUrl}/admin/restablecer?token=${token}`;

    await sendPasswordResetEmail({ to: email, resetUrl }).catch(() => {
      // Ne bloque pas l'utilisateur si l'envoi échoue : même message générique.
    });
  }

  redirect("/admin/recuperar?enviado=1");
}
