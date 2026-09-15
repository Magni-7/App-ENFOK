import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendReviewRequestEmail } from "@/lib/email";

// Appelé une fois par jour par Vercel Cron (voir vercel.json) : envoie une
// demande d'avis pour chaque cita terminée depuis peu, une seule fois par
// cita (reviewRequestedAt). Fenêtre de 7 jours pour éviter de relancer sur
// de très vieilles citas si le cron était resté inactif un moment.
const LOOKBACK_DAYS = 7;

export async function GET(request: NextRequest): Promise<NextResponse> {
  const authHeader = request.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const now = new Date();
  const lookbackStart = new Date(now.getTime() - LOOKBACK_DAYS * 24 * 60 * 60 * 1000);

  const bookings = await prisma.booking.findMany({
    where: {
      status: "CONFIRMED",
      reviewRequestedAt: null,
      clientEmail: { not: null },
      slot: { endAt: { lte: now, gte: lookbackStart } },
    },
    include: { slot: true, style: true, professional: true },
  });

  let sent = 0;
  for (const booking of bookings) {
    if (!booking.clientEmail) continue;

    const reviewUrl = `${request.nextUrl.origin}/resenar/${booking.id}`;

    try {
      await sendReviewRequestEmail({
        to: booking.clientEmail,
        professionalDisplayName: booking.professional.displayName,
        styleName: booking.style.name,
        reviewUrl,
      });
      await prisma.booking.update({
        where: { id: booking.id },
        data: { reviewRequestedAt: now },
      });
      sent += 1;
    } catch (error) {
      console.error(`Erreur en envoyant la demande d'avis pour la réservation ${booking.id}`, error);
    }
  }

  return NextResponse.json({ checked: bookings.length, sent });
}
