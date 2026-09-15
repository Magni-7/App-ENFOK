"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentClient } from "@/lib/clientAuth";
import { hashPassword, verifyPassword } from "@/lib/password";

export async function updateAccountDetails(formData: FormData): Promise<void> {
  const client = await getCurrentClient();
  if (!client) {
    redirect("/cuenta/login");
  }

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const phone = String(formData.get("phone") ?? "").trim();

  if (!name) {
    redirect("/cuenta/detalles?error=name_required");
  }
  if (!email || !email.includes("@")) {
    redirect("/cuenta/detalles?error=invalid_email");
  }

  const existingWithEmail = await prisma.client.findUnique({ where: { email } });
  if (existingWithEmail && existingWithEmail.id !== client.id) {
    redirect("/cuenta/detalles?error=email_used");
  }

  await prisma.client.update({
    where: { id: client.id },
    data: { name, email, phone: phone || null },
  });

  redirect("/cuenta/detalles?actualizado=1");
}

export async function updateAccountPassword(formData: FormData): Promise<void> {
  const client = await getCurrentClient();
  if (!client) {
    redirect("/cuenta/login");
  }

  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");
  const newPasswordConfirm = String(formData.get("newPasswordConfirm") ?? "");

  const currentValid = await verifyPassword(currentPassword, client.passwordHash);
  if (!currentValid) {
    redirect("/cuenta/detalles?error=current_password_invalid");
  }
  if (newPassword.length < 8) {
    redirect("/cuenta/detalles?error=password_short");
  }
  if (newPassword !== newPasswordConfirm) {
    redirect("/cuenta/detalles?error=password_mismatch");
  }

  const passwordHash = await hashPassword(newPassword);
  await prisma.client.update({ where: { id: client.id }, data: { passwordHash } });

  redirect("/cuenta/detalles?actualizado=1");
}
