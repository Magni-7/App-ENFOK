"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { put } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import { getDefaultProfessional } from "@/lib/professional";
import { COOKIE_NAME, createSessionCookieValue, isValidSessionCookieValue } from "@/lib/adminSession";
import { resizeImage } from "@/lib/image";
import { hashPassword, verifyPassword } from "@/lib/password";

const SALON_PHOTO_MAX_WIDTH = 1600;

async function requireAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(COOKIE_NAME)?.value;
  if (!isValidSessionCookieValue(sessionCookie)) {
    redirect("/admin/login");
  }
}

export async function login(formData: FormData): Promise<void> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  const professional = email ? await prisma.professional.findUnique({ where: { email } }) : null;
  const passwordValid = professional?.passwordHash
    ? await verifyPassword(password, professional.passwordHash)
    : false;

  if (!professional || !passwordValid) {
    redirect("/admin/login?error=1");
  }

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, createSessionCookieValue(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 jours
  });

  redirect("/admin");
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  redirect("/admin/login");
}

function timeToMinutes(value: string): number | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value);
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours < 0 || hours > 24 || minutes < 0 || minutes > 59) return null;
  return hours * 60 + minutes;
}

// Les jours sont soumis comme des cases à cocher "dayOff" (0 = dimanche ..
// 6 = samedi, voir Date.getDay()) : seuls les jours cochés sont présents
// dans formData, on reconstruit donc la liste complète des jours de repos.
// Les horaires (workDayStart/workDayEnd, format "HH:mm") définissent la
// fenêtre de travail quotidienne de la professionnelle.
export async function updateSchedule(formData: FormData): Promise<void> {
  const daysOff = formData
    .getAll("dayOff")
    .map((value) => Number(value))
    .filter((value) => Number.isInteger(value) && value >= 0 && value <= 6);

  const workDayStartMinutes = timeToMinutes(String(formData.get("workDayStart") ?? ""));
  const workDayEndMinutes = timeToMinutes(String(formData.get("workDayEnd") ?? ""));

  if (workDayStartMinutes === null || workDayEndMinutes === null || workDayEndMinutes <= workDayStartMinutes) {
    throw new Error("Por favor indica una hora de inicio y una hora de fin válidas (fin después de inicio).");
  }

  const professional = await getDefaultProfessional();

  await prisma.professional.update({
    where: { id: professional.id },
    data: { daysOff, workDayStartMinutes, workDayEndMinutes },
  });

  redirect("/admin");
}

export async function updateSalonPhoto(formData: FormData): Promise<void> {
  await requireAdminSession();

  const salonId = String(formData.get("salonId") ?? "");
  const photo = formData.get("photo");

  if (!(photo instanceof File) || photo.size === 0) {
    throw new Error("Por favor selecciona una foto.");
  }

  const professional = await getDefaultProfessional();
  const salon = await prisma.salon.findFirst({
    where: { id: salonId, professionalId: professional.id },
  });
  if (!salon) {
    throw new Error("Salón no encontrado.");
  }

  const { buffer, contentType } = await resizeImage(photo, SALON_PHOTO_MAX_WIDTH);
  const blob = await put(`salones/${salon.id}-${Date.now()}.jpg`, buffer, {
    access: "public",
    addRandomSuffix: true,
    contentType,
  });

  await prisma.salon.update({ where: { id: salon.id }, data: { photoUrl: blob.url } });

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath(`/profesionales/${professional.slug}`);
  redirect("/admin");
}

export async function updateAccountDetails(formData: FormData): Promise<void> {
  await requireAdminSession();

  const professional = await getDefaultProfessional();

  const displayName = String(formData.get("displayName") ?? "").trim();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const whatsappNumber = String(formData.get("whatsappNumber") ?? "").trim();

  if (!displayName) {
    redirect("/admin/detalles?error=name_required");
  }
  if (!email || !email.includes("@")) {
    redirect("/admin/detalles?error=invalid_email");
  }

  const existingWithEmail = await prisma.professional.findUnique({ where: { email } });
  if (existingWithEmail && existingWithEmail.id !== professional.id) {
    redirect("/admin/detalles?error=email_used");
  }

  await prisma.professional.update({
    where: { id: professional.id },
    data: { displayName, email, whatsappNumber: whatsappNumber || null },
  });

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath(`/profesionales/${professional.slug}`);
  redirect("/admin/detalles?actualizado=1");
}

export async function updateAccountPassword(formData: FormData): Promise<void> {
  await requireAdminSession();

  const professional = await getDefaultProfessional();

  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");
  const newPasswordConfirm = String(formData.get("newPasswordConfirm") ?? "");

  const currentValid = professional.passwordHash
    ? await verifyPassword(currentPassword, professional.passwordHash)
    : false;
  if (!currentValid) {
    redirect("/admin/detalles?error=current_password_invalid");
  }
  if (newPassword.length < 8) {
    redirect("/admin/detalles?error=password_short");
  }
  if (newPassword !== newPasswordConfirm) {
    redirect("/admin/detalles?error=password_mismatch");
  }

  const passwordHash = await hashPassword(newPassword);
  await prisma.professional.update({ where: { id: professional.id }, data: { passwordHash } });

  redirect("/admin/detalles?actualizado=1");
}
