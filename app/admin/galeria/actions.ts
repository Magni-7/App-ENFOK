"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { put, del } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import { requireProfessional } from "@/lib/professional";
import { slugify } from "@/lib/slug";
import { resizeImage } from "@/lib/image";

// Largeur max des photos de galerie : assez grande pour un carrousel plein
// écran, sans garder les fichiers bruts de plusieurs Mo pris au téléphone.
const GALLERY_PHOTO_MAX_WIDTH = 1600;

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
  const professional = await requireProfessional();

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
  const photos = formData.getAll("photos").filter((f): f is File => f instanceof File && f.size > 0);

  if (!name || !categoryId || !minHairLength || !priceCents || !durationMinutes) {
    throw new Error("Por favor completa todos los campos obligatorios con valores válidos.");
  }

  if (photos.length === 0) {
    throw new Error("Por favor selecciona al menos una foto.");
  }

  const category = await prisma.category.findFirst({
    where: { id: categoryId, professionalId: professional.id },
  });
  if (!category) {
    throw new Error("Categoría inválida.");
  }

  const blobs = await Promise.all(
    photos.map(async (photo, index) => {
      const { buffer, contentType } = await resizeImage(photo, GALLERY_PHOTO_MAX_WIDTH);
      return put(`galeria/${professional.id}-${Date.now()}-${index}.jpg`, buffer, {
        access: "public",
        addRandomSuffix: true,
        contentType,
      });
    })
  );

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
      photos: { create: blobs.map((blob, order) => ({ url: blob.url, alt: name, order })) },
    },
  });

  revalidatePath("/admin/galeria");
  revalidatePath("/galeria");
  revalidatePath("/catalogue");
  redirect("/admin/galeria");
}

export async function toggleGalleryItemActive(formData: FormData): Promise<void> {
  const professional = await requireProfessional();

  const styleId = String(formData.get("styleId") ?? "");

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

export async function createCategory(formData: FormData): Promise<void> {
  const professional = await requireProfessional();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) {
    throw new Error("Indica un nombre de categoría.");
  }

  const baseSlug = slugify(name) || "categoria";
  let slug = baseSlug;
  let suffix = 1;
  while (await prisma.category.findUnique({ where: { professionalId_slug: { professionalId: professional.id, slug } } })) {
    suffix += 1;
    slug = `${baseSlug}-${suffix}`;
  }

  const maxOrder = await prisma.category.aggregate({
    where: { professionalId: professional.id },
    _max: { order: true },
  });

  await prisma.category.create({
    data: { professionalId: professional.id, name, slug, order: (maxOrder._max.order ?? 0) + 1 },
  });

  revalidatePath("/admin/galeria");
  revalidatePath("/");
  revalidatePath("/catalogue");
}

export async function deleteGalleryItem(formData: FormData): Promise<void> {
  const professional = await requireProfessional();

  const styleId = String(formData.get("styleId") ?? "");

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
