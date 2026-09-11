import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPriceFrom, formatSlotDate, formatSlotTime } from "@/lib/format";
import { createBooking } from "./actions";

type ReservationPageProps = {
  params: Promise<{ styleId: string }>;
};

export default async function ReservationPage({ params }: ReservationPageProps) {
  const { styleId } = await params;
  const style = await prisma.style.findUnique({
    where: { id: styleId },
  });

  if (!style || !style.isActive) {
    notFound();
  }

  const now = new Date();
  const slots = await prisma.slot.findMany({
    where: {
      professionalId: style.professionalId,
      isBooked: false,
      startAt: { gt: now },
    },
    orderBy: { startAt: "asc" },
    take: 60,
  });

  const slotsByDate = new Map<string, typeof slots>();
  for (const slot of slots) {
    const dateKey = formatSlotDate(slot.startAt);
    const existing = slotsByDate.get(dateKey);
    if (existing) {
      existing.push(slot);
    } else {
      slotsByDate.set(dateKey, [slot]);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <Link href={`/styles/${style.id}`} className="text-sm text-ink/60 hover:text-ink">
        ← Volver a la ficha del estilo
      </Link>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Reservar: {style.name}</h1>
        <p className="mt-1 text-sm text-ink/70">{formatPriceFrom(style.basePriceCents)}</p>
      </div>

      {slots.length === 0 ? (
        <p className="text-sm text-ink/60">
          No hay ningún horario disponible por ahora. Contacta directamente con Eva para acordar una
          fecha.
        </p>
      ) : (
        <form action={createBooking} className="flex flex-col gap-8">
          <input type="hidden" name="styleId" value={style.id} />

          <fieldset className="flex flex-col gap-6">
            <legend className="mb-2 text-sm uppercase tracking-widest text-ink/60">
              1. Elige un horario
            </legend>
            {[...slotsByDate.entries()].map(([dateLabel, dateSlots]) => (
              <div key={dateLabel}>
                <p className="mb-2 text-sm font-medium">{dateLabel}</p>
                <div className="flex flex-wrap gap-2">
                  {dateSlots.map((slot) => (
                    <label
                      key={slot.id}
                      className="cursor-pointer border border-line px-4 py-2 text-sm transition has-[:checked]:border-ink has-[:checked]:bg-ink has-[:checked]:text-white"
                    >
                      <input
                        type="radio"
                        name="slotId"
                        value={slot.id}
                        required
                        className="sr-only"
                      />
                      {formatSlotTime(slot.startAt)}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </fieldset>

          <fieldset className="flex flex-col gap-4">
            <legend className="mb-2 text-sm uppercase tracking-widest text-ink/60">
              2. Tus datos
            </legend>

            <label className="flex flex-col gap-1 text-sm">
              Nombre completo *
              <input
                type="text"
                name="clientName"
                required
                className="border border-line px-3 py-2 focus:border-ink focus:outline-none"
              />
            </label>

            <label className="flex flex-col gap-1 text-sm">
              Teléfono (preferiblemente WhatsApp) *
              <input
                type="tel"
                name="clientPhone"
                required
                className="border border-line px-3 py-2 focus:border-ink focus:outline-none"
              />
            </label>

            <label className="flex flex-col gap-1 text-sm">
              Email (opcional)
              <input
                type="email"
                name="clientEmail"
                className="border border-line px-3 py-2 focus:border-ink focus:outline-none"
              />
            </label>

            <label className="flex flex-col gap-1 text-sm">
              Nota para Eva (opcional)
              <textarea
                name="notes"
                rows={3}
                className="border border-line px-3 py-2 focus:border-ink focus:outline-none"
              />
            </label>
          </fieldset>

          <button
            type="submit"
            className="border border-ink bg-ink px-6 py-3 text-sm font-medium uppercase tracking-wide text-white transition hover:bg-white hover:text-ink"
          >
            Confirmar la cita
          </button>
        </form>
      )}
    </div>
  );
}
