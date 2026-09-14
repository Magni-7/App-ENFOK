"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { createClientSessionCookieValue, CLIENT_COOKIE_NAME } from "@/lib/clientSession";
import { sendWelcomeEmail } from "@/lib/email";

export async function registerClient(formData: FormData): Promise<void> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  const passwordConfirm = String(formData.get("passwordConfirm") ?? "");

  if (!email || !email.includes("@")) {
    redirect("/cuenta/registro?error=invalid_email");
  }

  if (password.length < 8) {
    redirect("/cuenta/registro?error=password_short");
  }

  if (password !== passwordConfirm) {
    redirect("/cuenta/registro?error=password_mismatch");
  }

  const existingClient = await prisma.client.findUnique({ where: { email } });
  if (existingClient) {
    redirect("/cuenta/registro?error=email_used");
  }

  const passwordHash = await hashPassword(password);
  const client = await prisma.client.create({
    data: { email, name: name || null, passwordHash },
  });

  await sendWelcomeEmail({ to: email }).catch(() => {
    // L'échec de l'email de bienvenue ne doit pas bloquer la création du compte.
  });

  const cookieStore = await cookies();
  cookieStore.set(CLIENT_COOKIE_NAME, createClientSessionCookieValue(client.id), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 días
  });

  redirect("/cuenta");
}
