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

// Les jours sont soumis comme des cases à cocher "dayOff" (0 = dimanche ..
// 6 = samedi, voir Date.getDay()) : seuls les jours cochés sont présents
// dans formData, on reconstruit donc la liste complète des jours de repos.
export async function updateDaysOff(formData: FormData): Promise<void> {
  const daysOff = formData
    .getAll("dayOff")
    .map((value) => Number(value))
    .filter((value) => Number.isInteger(value) && value >= 0 && value <= 6);

  const professional = await getDefaultProfessional();

  await prisma.professional.update({
    where: { id: professional.id },
    data: { daysOff },
  });

  redirect("/admin");
}
