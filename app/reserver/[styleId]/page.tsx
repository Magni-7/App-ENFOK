import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatDepositMessage } from "@/lib/deposit";
import { formatPriceFrom, formatDuration } from "@/lib/format";
import { getAvailableStarts } from "@/lib/availability";
import ReservationForm from "@/components/ReservationForm";
import { createBooking } from "./actions";

type ReservationPageProps = {
  params: Promise<{ styleId: string }>;
};

export default async function ReservationPage({ params }: ReservationPageProps) {
  const { styleId } = await params;
  const style = await prisma.style.findUnique({
    where: { id: styleId },
    include: { professional: true },
  });

  if (!style || !style.isActive) {
    notFound();
  }

  const availableStarts = await getAvailableStarts(style.professionalId, style.durationMinutes);

  return (
    <div className="flex flex-col gap-8">
      <Link href={`/styles/${style.id}`} className="text-sm text-ink/60 hover:text-ink">
        ← Volver a la ficha del estilo
      </Link>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Reservar: {style.name}</h1>
        <p className="mt-1 text-sm text-ink/70">
          {formatPriceFrom(style.basePriceCents)} · {formatDuration(style.durationMinutes)}
        </p>
      </div>

      {style.professional.depositEnabled && style.professional.depositType && style.professional.depositValueCents && (
        <p className="border border-miel/40 bg-miel-bg p-4 text-sm text-[#7a5620]">
          {style.professional.displayName} pide{" "}
          {formatDepositMessage(style.professional.depositType, style.professional.depositValueCents)} al
          confirmar la cita.
        </p>
      )}

      {availableStarts.length === 0 ? (
        <p className="text-sm text-ink/60">
          No hay ningún horario disponible por ahora. Contacta directamente con {style.professional.displayName}{" "}
          para acordar una fecha.
        </p>
      ) : (
        <ReservationForm
          styleId={style.id}
          durationLabel={formatDuration(style.durationMinutes)}
          priceLabel={formatPriceFrom(style.basePriceCents)}
          starts={availableStarts.map((d) => d.toISOString())}
          createBooking={createBooking}
          professionalName={style.professional.displayName}
        />
      )}
    </div>
  );
}
