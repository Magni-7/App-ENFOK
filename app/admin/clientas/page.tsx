import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireProfessional } from "@/lib/professional";
import { formatSlotDate } from "@/lib/format";

export const metadata = { title: "Mis clientas — Trenzame" };

export default async function ClientasPage() {
  const professional = await requireProfessional();

  const bookings = await prisma.booking.findMany({
    where: { professionalId: professional.id, status: "CONFIRMED" },
    include: { slot: true },
    orderBy: { slot: { startAt: "desc" } },
  });

  const byPhone = new Map<string, { name: string; email: string | null; visits: number; lastVisit: Date }>();
  for (const booking of bookings) {
    const existing = byPhone.get(booking.clientPhone);
    if (existing) {
      existing.visits += 1;
    } else {
      byPhone.set(booking.clientPhone, {
        name: booking.clientName,
        email: booking.clientEmail,
        visits: 1,
        lastVisit: booking.slot.startAt,
      });
    }
  }
  const clients = Array.from(byPhone.entries()).sort((a, b) => b[1].lastVisit.getTime() - a[1].lastVisit.getTime());

  return (
    <div className="flex flex-col gap-8">
      <div>
        <Link href="/admin" className="text-sm text-ink/60 hover:text-ink">← Volver a la agenda</Link>
        <h1 className="mt-2 font-serif text-2xl font-semibold tracking-tight">Mis clientas</h1>
      </div>

      {clients.length === 0 ? (
        <p className="text-sm text-ink/60">Todavía no tienes citas confirmadas.</p>
      ) : (
        <div className="flex flex-col divide-y divide-line border-t border-line">
          {clients.map(([phone, client]) => (
            <div key={phone} className="flex items-center justify-between gap-4 py-4">
              <div>
                <p className="text-sm font-medium">{client.name}</p>
                <p className="text-xs text-ink/60">{phone}{client.email ? ` · ${client.email}` : ""}</p>
              </div>
              <div className="text-right text-xs text-ink/60">
                <p>{client.visits} {client.visits > 1 ? "citas" : "cita"}</p>
                <p>Última: {formatSlotDate(client.lastVisit)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
