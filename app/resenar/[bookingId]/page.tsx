import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { submitReview } from "./actions";

export const metadata: Metadata = {
  title: "Valora tu cita — Trenzame",
};

type ResenarPageProps = {
  params: Promise<{ bookingId: string }>;
  searchParams: Promise<{ enviado?: string }>;
};

const RATING_LABELS: Record<number, string> = {
  1: "1 — Muy mal",
  2: "2 — Regular",
  3: "3 — Bien",
  4: "4 — Muy bien",
  5: "5 — Excelente",
};

export default async function ResenarPage({ params, searchParams }: ResenarPageProps) {
  const { bookingId } = await params;
  const { enviado } = await searchParams;

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { slot: true, style: true, professional: true, review: true },
  });

  if (!booking) {
    notFound();
  }

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold tracking-tight">Valora tu cita</h1>
        <p className="mt-2 text-sm text-ink/70">
          {booking.style.name} con {booking.professional.displayName}
        </p>
      </div>

      {enviado || booking.review ? (
        <p className="border border-fern/40 bg-fern/10 p-4 text-sm text-fern">
          ¡Gracias por tu valoración! Ayuda a otras clientas a elegir con confianza.
        </p>
      ) : booking.slot.endAt > new Date() ? (
        <p className="border border-line bg-cream p-4 text-sm text-ink/80">
          Todavía no ha pasado tu cita — vuelve por aquí después para dejar tu valoración.
        </p>
      ) : (
        <form action={submitReview} className="flex flex-col gap-4">
          <input type="hidden" name="bookingId" value={booking.id} />

          <label className="flex flex-col gap-1 text-sm">
            Valoración
            <select
              name="rating"
              required
              defaultValue=""
              className="border border-line bg-paper px-3 py-2 focus:border-ink focus:outline-none"
            >
              <option value="" disabled>
                Elige una puntuación
              </option>
              {[5, 4, 3, 2, 1].map((value) => (
                <option key={value} value={value}>
                  {RATING_LABELS[value]}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1 text-sm">
            Comentario (opcional)
            <textarea
              name="comment"
              rows={4}
              placeholder="Cuéntanos qué tal tu experiencia..."
              className="border border-line px-3 py-2 focus:border-ink focus:outline-none"
            />
          </label>

          <button
            type="submit"
            className="border border-ink bg-ink px-6 py-3 text-sm font-medium uppercase tracking-wide text-white transition hover:bg-paper hover:text-ink"
          >
            Enviar valoración
          </button>
        </form>
      )}
    </div>
  );
}
