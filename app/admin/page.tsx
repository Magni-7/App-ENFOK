import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getDefaultProfessional } from "@/lib/professional";
import { COOKIE_NAME, isValidSessionCookieValue } from "@/lib/adminSession";
import { formatSlotDate, formatSlotTime } from "@/lib/format";
import { addSlot, logout } from "./actions";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(COOKIE_NAME)?.value;
  if (!isValidSessionCookieValue(sessionCookie)) {
    redirect("/admin/login");
  }

  const professional = await getDefaultProfessional();

  const bookings = await prisma.booking.findMany({
    where: {
      professionalId: professional.id,
      status: "CONFIRMED",
      slot: { startAt: { gte: new Date() } },
    },
    include: { style: true, slot: true },
    orderBy: { slot: { startAt: "asc" } },
  });

  const openSlotsCount = await prisma.slot.count({
    where: { professionalId: professional.id, isBooked: false, startAt: { gte: new Date() } },
  });

  return (
    <div className="flex flex-col gap-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Agenda — {professional.displayName}</h1>
        <form action={logout}>
          <button type="submit" className="text-sm text-ink/60 underline underline-offset-4 hover:text-ink">
            Se déconnecter
          </button>
        </form>
      </div>

      <section>
        <h2 className="mb-4 text-sm uppercase tracking-widest text-ink/60">
          Rendez-vous à venir ({bookings.length})
        </h2>
        {bookings.length === 0 ? (
          <p className="text-sm text-ink/60">Aucun rendez-vous pour le moment.</p>
        ) : (
          <div className="flex flex-col divide-y divide-line border-y border-line">
            {bookings.map((booking) => (
              <div key={booking.id} className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium">{booking.style.name}</p>
                  <p className="text-sm text-ink/70">
                    {booking.clientName} · {booking.clientPhone}
                    {booking.clientEmail ? ` · ${booking.clientEmail}` : ""}
                  </p>
                  {booking.notes && <p className="mt-1 text-sm italic text-ink/60">« {booking.notes} »</p>}
                </div>
                <div className="text-sm text-ink/80 sm:text-right">
                  <p>{formatSlotDate(booking.slot.startAt)}</p>
                  <p>{formatSlotTime(booking.slot.startAt)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="border-t border-line pt-8">
        <h2 className="mb-1 text-sm uppercase tracking-widest text-ink/60">Ajouter un créneau disponible</h2>
        <p className="mb-4 text-sm text-ink/60">
          {openSlotsCount} créneau(x) disponible(s) à venir, ouverts à la réservation.
        </p>
        <form action={addSlot} className="flex flex-wrap items-end gap-4">
          <label className="flex flex-col gap-1 text-sm">
            Date
            <input
              type="date"
              name="date"
              required
              className="border border-line px-3 py-2 focus:border-ink focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Heure de début
            <input
              type="time"
              name="startTime"
              required
              className="border border-line px-3 py-2 focus:border-ink focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Durée (minutes)
            <input
              type="number"
              name="durationMinutes"
              defaultValue={240}
              min={15}
              step={15}
              required
              className="w-32 border border-line px-3 py-2 focus:border-ink focus:outline-none"
            />
          </label>
          <button
            type="submit"
            className="border border-ink bg-ink px-6 py-2 text-sm font-medium uppercase tracking-wide text-white transition hover:bg-white hover:text-ink"
          >
            Ajouter
          </button>
        </form>
      </section>
    </div>
  );
}
