"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getDefaultProfessional } from "@/lib/professional";
import { COOKIE_NAME, createSessionCookieValue } from "@/lib/adminSession";

export async function login(formData: FormData): Promise<void> {
  const password = String(formData.get("password") ?? "");
  const expected = process.env.ADMIN_PASSWORD;

  if (!expected || password !== expected) {
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

export async function addSlot(formData: FormData): Promise<void> {
  const date = String(formData.get("date") ?? "");
  const startTime = String(formData.get("startTime") ?? "");
  const durationMinutes = Number(formData.get("durationMinutes") ?? 0);

  if (!date || !startTime || !durationMinutes) {
    throw new Error("Merci de renseigner une date, une heure de début et une durée.");
  }

  const professional = await getDefaultProfessional();
  const startAt = new Date(`${date}T${startTime}:00`);
  const endAt = new Date(startAt.getTime() + durationMinutes * 60_000);

  await prisma.slot.create({
    data: {
      professionalId: professional.id,
      startAt,
      endAt,
    },
  });

  redirect("/admin");
}
