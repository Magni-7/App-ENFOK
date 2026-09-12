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
