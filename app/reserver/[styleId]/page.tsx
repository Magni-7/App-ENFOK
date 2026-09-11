import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPriceFrom } from "@/lib/format";
import ReservationForm from "@/components/ReservationForm";
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
        <ReservationForm
          styleId={style.id}
          slots={slots.map((slot) => ({ id: slot.id, startAt: slot.startAt.toISOString() }))}
          createBooking={createBooking}
        />
      )}
    </div>
  );
}
