"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentClient } from "@/lib/clientAuth";
import { sendBookingConfirmationEmail, sendBookingNotificationEmail } from "@/lib/email";
import { formatPriceFrom } from "@/lib/format";

export async function createBooking(formData: FormData): Promise<void> {
  const styleId = String(formData.get("styleId") ?? "");
  const startAtRaw = String(formData.get("startAt") ?? "");
  const clientName = String(formData.get("clientName") ?? "").trim();
  const clientPhone = String(formData.get("clientPhone") ?? "").trim();
  const clientEmail = String(formData.get("clientEmail") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  if (!styleId || !startAtRaw || !clientName || !clientPhone) {
    throw new Error("Por favor completa el estilo, el horario, tu nombre y tu teléfono.");
  }

  const startAt = new Date(startAtRaw);
  if (Number.isNaN(startAt.getTime())) {
    throw new Error("Horario inválido.");
  }

  const client = await getCurrentClient();
  const style = await prisma.style.findUniqueOrThrow({ where: { id: styleId } });
  const professional = await prisma.professional.findUniqueOrThrow({
    where: { id: style.professionalId },
  });
  const endAt = new Date(startAt.getTime() + style.durationMinutes * 60_000);
  const bufferMs = professional.bufferMinutes * 60_000;
  // Fin réelle occupée (avec marge de retard), utilisée uniquement pour la
  // détection de chevauchement avec les autres rendez-vous confirmés. La
  // marge est symétrique : on la compare aussi avant le début des autres
  // rendez-vous existants (leur propre marge après leur fin).
  const busyEndAt = new Date(endAt.getTime() + bufferMs);
  const overlapFloor = new Date(startAt.getTime() - bufferMs);

  const booking = await prisma.$transaction(async (tx) => {
    const overlapping = await tx.booking.findFirst({
      where: {
        professionalId: style.professionalId,
        status: "CONFIRMED",
        slot: { startAt: { lt: busyEndAt }, endAt: { gt: overlapFloor } },
      },
    });

    if (overlapping) {
      throw new Error("Este horario acaba de ser reservado por otra persona. Elige otro, por favor.");
    }

    const slot = await tx.slot.create({
      data: { professionalId: style.professionalId, startAt, endAt },
    });

    return tx.booking.create({
      data: {
        professionalId: style.professionalId,
        styleId,
        slotId: slot.id,
        clientId: client?.id,
        clientName,
        clientPhone,
        clientEmail: clientEmail || null,
        notes: notes || null,
      },
    });
  });

  // Les emails ne doivent jamais faire échouer une réservation déjà confirmée
  // en base (mail non vérifié, Resend indisponible, etc.).
  if (booking.clientEmail) {
    try {
      await sendBookingConfirmationEmail({
        to: booking.clientEmail,
        professionalDisplayName: professional.displayName,
        styleName: style.name,
        startAt,
        priceLabel: formatPriceFrom(style.basePriceCents),
      });
    } catch (error) {
      console.error(`Erreur en envoyant la confirmation de réservation ${booking.id}`, error);
    }
  }

  if (professional.email) {
    try {
      await sendBookingNotificationEmail({
        to: professional.email,
        clientName,
        clientPhone,
        styleName: style.name,
        startAt,
      });
    } catch (error) {
      console.error(`Erreur en envoyant la notification de réservation ${booking.id}`, error);
    }
  }

  redirect(`/merci?bookingId=${booking.id}`);
}
