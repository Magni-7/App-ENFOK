"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { COOKIE_NAME, createSessionCookieValue } from "@/lib/adminSession";

export async function resetProfessionalPassword(formData: FormData): Promise<void> {
  const token = String(formData.get("token") ?? "");
  const password = String(formData.get("password") ?? "");
  const passwordConfirm = String(formData.get("passwordConfirm") ?? "");

  const resetToken = await prisma.professionalPasswordResetToken.findUnique({ where: { token } });
  const isValid = resetToken && !resetToken.usedAt && resetToken.expiresAt > new Date();

  if (!isValid) {
    redirect("/admin/recuperar?enviado=1");
  }

  if (password.length < 8) {
    redirect(`/admin/restablecer?token=${token}&error=password_short`);
  }
  if (password !== passwordConfirm) {
    redirect(`/admin/restablecer?token=${token}&error=password_mismatch`);
  }

  const passwordHash = await hashPassword(password);

  await prisma.$transaction([
    prisma.professional.update({ where: { id: resetToken.professionalId }, data: { passwordHash } }),
    prisma.professionalPasswordResetToken.update({ where: { id: resetToken.id }, data: { usedAt: new Date() } }),
  ]);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, createSessionCookieValue(resetToken.professionalId), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 días
  });

  redirect("/admin");
}
