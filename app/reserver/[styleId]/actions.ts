"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function createBooking(formData: FormData): Promise<void> {
  const styleId = String(formData.get("styleId") ?? "");
  const slotId = String(formData.get("slotId") ?? "");
  const clientName = String(formData.get("clientName") ?? "").trim();
  const clientPhone = String(formData.get("clientPhone") ?? "").trim();
  const clientEmail = String(formData.get("clientEmail") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  if (!styleId || !slotId || !clientName || !clientPhone) {
    throw new Error("Merci de remplir le style, le créneau, votre nom et votre téléphone.");
  }

  const style = await prisma.style.findUniqueOrThrow({ where: { id: styleId } });

  const booking = await prisma.$transaction(async (tx) => {
    const slot = await tx.slot.findUniqueOrThrow({ where: { id: slotId } });

    if (slot.isBooked) {
      throw new Error("Ce créneau vient d'être réservé par quelqu'un d'autre. Merci d'en choisir un autre.");
    }

    await tx.slot.update({ where: { id: slotId }, data: { isBooked: true } });

    return tx.booking.create({
      data: {
        professionalId: style.professionalId,
        styleId,
        slotId,
        clientName,
        clientPhone,
        clientEmail: clientEmail || null,
        notes: notes || null,
      },
    });
  });

  redirect(`/merci?bookingId=${booking.id}`);
}
