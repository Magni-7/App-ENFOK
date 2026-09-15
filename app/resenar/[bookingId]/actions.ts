"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function submitReview(formData: FormData): Promise<void> {
  const bookingId = String(formData.get("bookingId") ?? "");
  const rating = Number(formData.get("rating"));
  const comment = String(formData.get("comment") ?? "").trim();

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new Error("Por favor selecciona una valoración entre 1 y 5.");
  }

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { slot: true, review: true },
  });

  if (!booking) {
    throw new Error("Cita no encontrada.");
  }
  if (booking.review) {
    throw new Error("Ya has valorado esta cita.");
  }
  if (booking.slot.endAt > new Date()) {
    throw new Error("Todavía no ha pasado tu cita.");
  }

  await prisma.review.create({
    data: {
      bookingId: booking.id,
      professionalId: booking.professionalId,
      rating,
      comment: comment || null,
    },
  });

  redirect(`/resenar/${booking.id}?enviado=1`);
}
