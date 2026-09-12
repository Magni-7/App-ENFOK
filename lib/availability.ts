import { prisma } from "@/lib/prisma";

type BusyInterval = {
  start: number; // minutes depuis minuit du jour concerné
  end: number; // fin réelle + marge de sécurité (voir bufferMinutes)
};

const SLOT_STEP_MINUTES = 60;

function minutesSinceMidnight(date: Date): number {
  return date.getHours() * 60 + date.getMinutes();
}

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60_000);
}

/**
 * Calcule, pour les `daysAhead` prochains jours, tous les horaires de début
 * disponibles (par pas d'une heure entre l'ouverture et la fermeture) pour un
 * rendez-vous de `durationMinutes`. Un rendez-vous occupe sa durée réelle +
 * `bufferMinutes` (marge de retard) de la professionnelle, tous styles
 * confondus : réserver un créneau bloque automatiquement les horaires qui
 * chevaucheraient ce rendez-vous pour les autres client·es.
 */
export async function getAvailableStarts(
  professionalId: string,
  durationMinutes: number,
  { daysAhead = 45, fromDate = new Date() }: { daysAhead?: number; fromDate?: Date } = {}
): Promise<Date[]> {
  const professional = await prisma.professional.findUniqueOrThrow({
    where: { id: professionalId },
  });

  const rangeStart = startOfDay(fromDate);
  const rangeEnd = addMinutes(rangeStart, (daysAhead + 1) * 24 * 60);

  const existingBookings = await prisma.booking.findMany({
    where: {
      professionalId,
      status: "CONFIRMED",
      slot: { startAt: { gte: rangeStart, lt: rangeEnd } },
    },
    include: { slot: true, style: true },
  });

  const busyByDay = new Map<string, BusyInterval[]>();
  for (const booking of existingBookings) {
    const key = startOfDay(booking.slot.startAt).toISOString();
    const start = minutesSinceMidnight(booking.slot.startAt);
    const end = start + booking.style.durationMinutes + professional.bufferMinutes;
    const list = busyByDay.get(key) ?? [];
    list.push({ start, end });
    busyByDay.set(key, list);
  }

  const results: Date[] = [];

  for (let i = 0; i < daysAhead; i++) {
    const day = addMinutes(rangeStart, i * 24 * 60);
    if (professional.daysOff.includes(day.getDay())) continue;

    const isToday = day.getTime() === rangeStart.getTime();
    const busy = busyByDay.get(day.toISOString()) ?? [];

    for (
      let candidateStart = professional.workDayStartMinutes;
      candidateStart + durationMinutes <= professional.workDayEndMinutes;
      candidateStart += SLOT_STEP_MINUTES
    ) {
      const candidateEnd = candidateStart + durationMinutes;
      const candidateBufferedEnd = candidateEnd + professional.bufferMinutes;

      if (isToday && candidateStart < minutesSinceMidnight(fromDate)) continue;

      const overlaps = busy.some(
        (b) => candidateStart < b.end && b.start < candidateBufferedEnd
      );
      if (overlaps) continue;

      results.push(addMinutes(day, candidateStart));
    }
  }

  return results;
}
