"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";
import { createClientSessionCookieValue, CLIENT_COOKIE_NAME } from "@/lib/clientSession";

export async function loginClient(formData: FormData): Promise<void> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  const client = email ? await prisma.client.findUnique({ where: { email } }) : null;
  const passwordValid = client ? await verifyPassword(password, client.passwordHash) : false;

  if (!client || !passwordValid) {
    redirect("/cuenta/login?error=1");
  }

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
