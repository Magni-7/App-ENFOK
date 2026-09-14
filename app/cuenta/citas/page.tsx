import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentClient } from "@/lib/clientAuth";
import { formatSlotDate, formatSlotTime, formatPriceFrom } from "@/lib/format";

export const metadata: Metadata = {
  title: "Mis citas — Trenzame",
};

export default async function CitasPage() {
  const client = await getCurrentClient();

  if (!client) {
    redirect("/cuenta/login");
  }

  const bookings = await prisma.booking.findMany({
    where: { clientId: client.id },
    include: { style: true, slot: true },
    orderBy: { slot: { startAt: "desc" } },
  });

  const now = new Date();
  const upcoming = bookings.filter((b) => b.status === "CONFIRMED" && b.slot.startAt >= now);
  const past = bookings.filter((b) => !(b.status === "CONFIRMED" && b.slot.startAt >= now));

  return (
    <div className="flex flex-col gap-10">
      <h1 className="font-serif text-2xl font-semibold tracking-tight">Mis citas</h1>

      <section>
        <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-ink/60">Próximas</h2>
        {upcoming.length === 0 ? (
          <p className="text-sm text-ink/60">No tienes ninguna cita próxima.</p>
        ) : (
          <div className="flex flex-col divide-y divide-line border-y border-line">
            {upcoming.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between gap-4 py-4">
                <div>
                  <p className="font-serif font-medium">{booking.style.name}</p>
                  <p className="mt-1 font-mono text-xs text-ink/60">{formatPriceFrom(booking.style.basePriceCents)}</p>
                </div>
                <div className="text-right text-sm">
                  <p>{formatSlotDate(booking.slot.startAt)}</p>
                  <p className="font-mono text-ink/70">{formatSlotTime(booking.slot.startAt)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-ink/60">Historial</h2>
        {past.length === 0 ? (
          <p className="text-sm text-ink/60">Todavía no tienes ninguna cita pasada.</p>
        ) : (
          <div className="flex flex-col divide-y divide-line border-y border-line">
            {past.map((booking) => (
              <div key={booking.id} className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-serif font-medium">{booking.style.name}</p>
                  <p className="mt-1 text-xs text-ink/50">
                    {booking.status === "CANCELLED" ? "Cancelada" : "Realizada"} ·{" "}
                    {formatSlotDate(booking.slot.startAt)}
                  </p>
                </div>
                <Link
                  href={`/reserver/${booking.style.id}`}
                  className="self-start border border-line px-4 py-2 text-xs font-medium uppercase tracking-wide transition hover:border-clay hover:text-clay"
                >
                  Reservar de nuevo
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
