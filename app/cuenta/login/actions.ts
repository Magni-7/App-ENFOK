"use server";

import { randomBytes } from "crypto";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { sendLoginEmail } from "@/lib/email";

const TOKEN_TTL_MINUTES = 15;

async function getBaseUrl(): Promise<string> {
  const headerList = await headers();
  const host = headerList.get("host") ?? "localhost:3000";
  const protocol = host.startsWith("localhost") ? "http" : "https";
  return `${protocol}://${host}`;
}

export async function requestLoginLink(formData: FormData): Promise<void> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();

  if (!email || !email.includes("@")) {
    throw new Error("Por favor indica un email válido.");
  }

  const existingClient = await prisma.client.findUnique({ where: { email } });
  const client = existingClient ?? (await prisma.client.create({ data: { email } }));
  const isNewClient = !existingClient;

  const token = randomBytes(32).toString("hex");
  await prisma.loginToken.create({
    data: {
      clientId: client.id,
      token,
      expiresAt: new Date(Date.now() + TOKEN_TTL_MINUTES * 60_000),
    },
  });

  const baseUrl = await getBaseUrl();
  const loginUrl = `${baseUrl}/cuenta/verificar?token=${token}`;

  await sendLoginEmail({ to: email, loginUrl, isNewClient });

  redirect(`/cuenta/login?enviado=1`);
}
