"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { createClientSessionCookieValue, CLIENT_COOKIE_NAME } from "@/lib/clientSession";

export async function resetPassword(formData: FormData): Promise<void> {
  const token = String(formData.get("token") ?? "");
  const password = String(formData.get("password") ?? "");
  const passwordConfirm = String(formData.get("passwordConfirm") ?? "");

  const resetToken = await prisma.passwordResetToken.findUnique({ where: { token } });
  const isValid = resetToken && !resetToken.usedAt && resetToken.expiresAt > new Date();

  if (!isValid) {
    redirect("/cuenta/recuperar?enviado=1");
  }

  if (password.length < 8) {
    redirect(`/cuenta/restablecer?token=${token}&error=password_short`);
  }
  if (password !== passwordConfirm) {
    redirect(`/cuenta/restablecer?token=${token}&error=password_mismatch`);
  }

  const passwordHash = await hashPassword(password);

  await prisma.$transaction([
    prisma.client.update({ where: { id: resetToken.clientId }, data: { passwordHash } }),
    prisma.passwordResetToken.update({ where: { id: resetToken.id }, data: { usedAt: new Date() } }),
  ]);

  const cookieStore = await cookies();
  cookieStore.set(CLIENT_COOKIE_NAME, createClientSessionCookieValue(resetToken.clientId), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 días
  });

  redirect("/cuenta");
}
