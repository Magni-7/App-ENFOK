import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendBookingReminderEmail } from "@/lib/email";

// Appelé une fois par jour par Vercel Cron (voir vercel.json) : envoie un
// rappel pour chaque cita qui a lieu dans les prochaines 24h, une seule fois
// par cita (reminderSentAt). Fenêtre de 2h (23h-25h) car le cron ne tourne
// qu'une fois par jour, pas toutes les heures.
const WINDOW_START_HOURS = 23;
const WINDOW_END_HOURS = 25;

export async function GET(request: NextRequest): Promise<NextResponse> {
  const authHeader = request.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const now = new Date();
  const windowStart = new Date(now.getTime() + WINDOW_START_HOURS * 60 * 60 * 1000);
  const windowEnd = new Date(now.getTime() + WINDOW_END_HOURS * 60 * 60 * 1000);

  const bookings = await prisma.booking.findMany({
    where: {
      status: "CONFIRMED",
      reminderSentAt: null,
      clientEmail: { not: null },
      slot: { startAt: { gte: windowStart, lte: windowEnd } },
    },
    include: { slot: true, style: true, professional: true },
  });

  let sent = 0;
  for (const booking of bookings) {
    if (!booking.clientEmail) continue;

    try {
      await sendBookingReminderEmail({
        to: booking.clientEmail,
        professionalDisplayName: booking.professional.displayName,
        styleName: booking.style.name,
        startAt: booking.slot.startAt,
      });
      await prisma.booking.update({
        where: { id: booking.id },
        data: { reminderSentAt: now },
      });
      sent += 1;
    } catch (error) {
      console.error(`Erreur en envoyant le rappel pour la réservation ${booking.id}`, error);
    }
  }

  return NextResponse.json({ checked: bookings.length, sent });
}
