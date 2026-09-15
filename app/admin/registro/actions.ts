"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { slugify } from "@/lib/slug";
import { COOKIE_NAME, createSessionCookieValue } from "@/lib/adminSession";
import { sendProfessionalWelcomeEmail } from "@/lib/email";

export async function registerProfessional(formData: FormData): Promise<void> {
  const displayName = String(formData.get("displayName") ?? "").trim();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const whatsappNumber = String(formData.get("whatsappNumber") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const passwordConfirm = String(formData.get("passwordConfirm") ?? "");

  if (!displayName) {
    redirect("/admin/registro?error=name_required");
  }
  if (!email || !email.includes("@")) {
    redirect("/admin/registro?error=invalid_email");
  }
  if (password.length < 8) {
    redirect("/admin/registro?error=password_short");
  }
  if (password !== passwordConfirm) {
    redirect("/admin/registro?error=password_mismatch");
  }

  const existingProfessional = await prisma.professional.findUnique({ where: { email } });
  if (existingProfessional) {
    redirect("/admin/registro?error=email_used");
  }

  const baseSlug = slugify(displayName) || "salon";
  let slug = baseSlug;
  let suffix = 1;
  while (await prisma.professional.findUnique({ where: { slug } })) {
    suffix += 1;
    slug = `${baseSlug}-${suffix}`;
  }

  const passwordHash = await hashPassword(password);
  const professional = await prisma.professional.create({
    data: {
      slug,
      displayName,
      email,
      whatsappNumber: whatsappNumber || null,
      passwordHash,
    },
  });

  await sendProfessionalWelcomeEmail({ to: email, displayName }).catch(() => {
    // L'échec de l'email de bienvenue ne doit pas bloquer la création du compte.
  });

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, createSessionCookieValue(professional.id), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 días
  });

  redirect("/admin");
}
