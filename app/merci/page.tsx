import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatSlotDate, formatSlotTime } from "@/lib/format";

type MerciPageProps = {
  searchParams: Promise<{ bookingId?: string }>;
};

export default async function MerciPage({ searchParams }: MerciPageProps) {
  const { bookingId } = await searchParams;
  if (!bookingId) {
    notFound();
  }

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { style: true, slot: true, professional: true },
  });

  if (!booking) {
    notFound();
  }

  return (
    <div className="flex flex-col items-center gap-6 py-12 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">Rendez-vous confirmé !</h1>
      <p className="text-ink/70">
        Merci {booking.clientName}, votre rendez-vous avec {booking.professional.displayName} est
        enregistré.
      </p>

      <dl className="w-full max-w-sm border border-line p-6 text-left text-sm">
        <div className="flex justify-between border-b border-line py-2">
          <dt className="text-ink/50">Style</dt>
          <dd className="font-medium">{booking.style.name}</dd>
        </div>
        <div className="flex justify-between border-b border-line py-2">
          <dt className="text-ink/50">Date</dt>
          <dd className="font-medium">{formatSlotDate(booking.slot.startAt)}</dd>
        </div>
        <div className="flex justify-between py-2">
          <dt className="text-ink/50">Heure</dt>
          <dd className="font-medium">{formatSlotTime(booking.slot.startAt)}</dd>
        </div>
      </dl>

      <Link href="/catalogue" className="text-sm underline underline-offset-4 hover:no-underline">
        Retour au catalogue
      </Link>
    </div>
  );
}
