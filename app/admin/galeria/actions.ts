"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { put, del } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import { getDefaultProfessional } from "@/lib/professional";
import { COOKIE_NAME, isValidSessionCookieValue } from "@/lib/adminSession";

async function requireAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(COOKIE_NAME)?.value;
  if (!isValidSessionCookieValue(sessionCookie)) {
    redirect("/admin/login");
  }
}

function parsePriceEuros(value: string): number | null {
  const normalized = value.replace(",", ".");
  const euros = Number(normalized);
  if (!Number.isFinite(euros) || euros <= 0) return null;
  return Math.round(euros * 100);
}

function parseDurationMinutes(hours: string, minutes: string): number | null {
  const h = Number(hours || "0");
  const m = Number(minutes || "0");
  if (!Number.isInteger(h) || !Number.isInteger(m) || h < 0 || m < 0 || m > 59) return null;
  const total = h * 60 + m;
  if (total <= 0) return null;
  return total;
}

export async function createGalleryItem(formData: FormData): Promise<void> {
  await requireAdminSession();

  const professional = await getDefaultProfessional();

  const name = String(formData.get("name") ?? "").trim();
  const categoryId = String(formData.get("categoryId") ?? "");
  const description = String(formData.get("description") ?? "").trim();
  const minHairLength = String(formData.get("minHairLength") ?? "").trim();
  const hairProvidedBy = String(formData.get("hairProvidedBy") ?? "CLIENT");
  const priceCents = parsePriceEuros(String(formData.get("priceEuros") ?? ""));
  const durationMinutes = parseDurationMinutes(
    String(formData.get("durationHours") ?? ""),
    String(formData.get("durationMinutes") ?? "")
  );
  const photo = formData.get("photo");

  if (!name || !categoryId || !minHairLength || !priceCents || !durationMinutes) {
    throw new Error("Por favor completa todos los campos obligatorios con valores válidos.");
  }

  if (!(photo instanceof File) || photo.size === 0) {
    throw new Error("Por favor selecciona una foto.");
  }

  const category = await prisma.category.findFirst({
    where: { id: categoryId, professionalId: professional.id },
  });
  if (!category) {
    throw new Error("Categoría inválida.");
  }

  const extension = photo.name.split(".").pop() || "jpg";
  const blob = await put(`galeria/${professional.id}-${Date.now()}.${extension}`, photo, {
    access: "public",
    addRandomSuffix: true,
  });

  await prisma.style.create({
    data: {
      professionalId: professional.id,
      categoryId: category.id,
      name,
      description: description || null,
      basePriceCents: priceCents,
      durationMinutes,
      minHairLength,
      hairProvidedBy: hairProvidedBy === "PROFESSIONAL" ? "PROFESSIONAL" : "CLIENT",
      photos: { create: { url: blob.url, alt: name, order: 0 } },
    },
  });

  revalidatePath("/admin/galeria");
  revalidatePath("/galeria");
  revalidatePath("/catalogue");
  redirect("/admin/galeria");
}

export async function toggleGalleryItemActive(formData: FormData): Promise<void> {
  await requireAdminSession();

  const styleId = String(formData.get("styleId") ?? "");
  const professional = await getDefaultProfessional();

  const style = await prisma.style.findFirst({
    where: { id: styleId, professionalId: professional.id },
  });
  if (!style) throw new Error("Estilo no encontrado.");

  await prisma.style.update({
    where: { id: style.id },
    data: { isActive: !style.isActive },
  });

  revalidatePath("/admin/galeria");
  revalidatePath("/galeria");
  revalidatePath("/catalogue");
}

export async function deleteGalleryItem(formData: FormData): Promise<void> {
  await requireAdminSession();

  const styleId = String(formData.get("styleId") ?? "");
  const professional = await getDefaultProfessional();

  const style = await prisma.style.findFirst({
    where: { id: styleId, professionalId: professional.id },
    include: { photos: true, bookings: { take: 1 } },
  });
  if (!style) throw new Error("Estilo no encontrado.");

  if (style.bookings.length > 0) {
    throw new Error("No se puede eliminar: ya tiene reservas. Desactívala en su lugar.");
  }

  await prisma.$transaction([
    prisma.stylePhoto.deleteMany({ where: { styleId: style.id } }),
    prisma.style.delete({ where: { id: style.id } }),
  ]);

  await Promise.all(
    style.photos.map((photo) =>
      del(photo.url).catch(() => {
        // Ignore les échecs de suppression du fichier (ex. déjà supprimé) :
        // la fiche en base est déjà supprimée, pas la peine de faire échouer l'action.
      })
    )
  );

  revalidatePath("/admin/galeria");
  revalidatePath("/galeria");
  revalidatePath("/catalogue");
}
