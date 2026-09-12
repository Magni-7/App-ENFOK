import { prisma } from "@/lib/prisma";

export type AvailableStart = {
  startAt: Date;
  endAt: Date;
};

type BusyInterval = {
  start: number; // minutes depuis minuit du jour concerné
  end: number;
};

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
 * Calcule, pour les `daysAhead` prochains jours, le premier horaire de début
 * disponible par jour pour un rendez-vous de `durationMinutes`. Un rendez-vous
 * occupe sa durée réelle + `bufferMinutes` (marge de retard) de la
 * professionnelle, tous styles confondus — un jour peut donc afficher un seul
 * horaire proposé (le premier créneau libre assez grand), pas tous les
 * horaires possibles minute par minute.
 */
export async function getNextAvailableStarts(
  professionalId: string,
  durationMinutes: number,
  { daysAhead = 45, fromDate = new Date() }: { daysAhead?: number; fromDate?: Date } = {}
): Promise<AvailableStart[]> {
  const professional = await prisma.professional.findUniqueOrThrow({
    where: { id: professionalId },
  });

  const rangeStart = startOfDay(fromDate);
  const rangeEnd = addMinutes(startOfDay(fromDate), (daysAhead + 1) * 24 * 60);

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
    const day = startOfDay(booking.slot.startAt);
    const key = day.toISOString();
    const start = minutesSinceMidnight(booking.slot.startAt);
    const end = start + booking.style.durationMinutes + professional.bufferMinutes;
    const list = busyByDay.get(key) ?? [];
    list.push({ start, end });
    busyByDay.set(key, list);
  }

  const results: AvailableStart[] = [];

  for (let i = 0; i < daysAhead; i++) {
    const day = addMinutes(startOfDay(fromDate), i * 24 * 60);
    if (professional.daysOff.includes(day.getDay())) continue;

    const isToday = day.getTime() === startOfDay(fromDate).getTime();
    const dayFloor = isToday
      ? Math.max(professional.workDayStartMinutes, minutesSinceMidnight(fromDate))
      : professional.workDayStartMinutes;

    const busy = (busyByDay.get(day.toISOString()) ?? []).sort((a, b) => a.start - b.start);

    let cursor = dayFloor;
    let found: number | null = null;

    for (const interval of busy) {
      const gapEnd = Math.min(interval.start, professional.workDayEndMinutes);
      if (gapEnd - cursor >= durationMinutes) {
        found = cursor;
        break;
      }
      cursor = Math.max(cursor, interval.end);
    }

    if (found === null && professional.workDayEndMinutes - cursor >= durationMinutes) {
      found = cursor;
    }

    if (found !== null) {
      const startAt = addMinutes(day, found);
      results.push({ startAt, endAt: addMinutes(startAt, durationMinutes) });
    }
  }

  return results;
}
