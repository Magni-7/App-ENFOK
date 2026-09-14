import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getDefaultProfessional } from "@/lib/professional";
import { COOKIE_NAME, isValidSessionCookieValue } from "@/lib/adminSession";
import { formatSlotDate, formatSlotTime } from "@/lib/format";
import { updateSchedule, logout } from "./actions";

function minutesToTimeInput(minutes: number): string {
  const h = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

const WEEKDAYS = [
  { value: 1, label: "Lunes" },
  { value: 2, label: "Martes" },
  { value: 3, label: "Miércoles" },
  { value: 4, label: "Jueves" },
  { value: 5, label: "Viernes" },
  { value: 6, label: "Sábado" },
  { value: 0, label: "Domingo" },
];

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

  return (
    <div className="flex flex-col gap-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Agenda — {professional.displayName}</h1>
        <div className="flex items-center gap-4">
          <Link href="/admin/galeria" className="text-sm underline underline-offset-4 hover:text-ink">
            Gestionar galería
          </Link>
          <form action={logout}>
            <button type="submit" className="text-sm text-ink/60 underline underline-offset-4 hover:text-ink">
              Cerrar sesión
            </button>
          </form>
        </div>
      </div>

      <section>
        <h2 className="mb-4 text-sm uppercase tracking-widest text-ink/60">
          Próximas citas ({bookings.length})
        </h2>
        {bookings.length === 0 ? (
          <p className="text-sm text-ink/60">No hay citas por ahora.</p>
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
        <h2 className="mb-1 text-sm uppercase tracking-widest text-ink/60">Horario de trabajo</h2>
        <p className="mb-4 text-sm text-ink/60">
          Define tu horario habitual y tus días de descanso. Fuera de estos horarios, las clientas no
          podrán reservar.
        </p>
        <form action={updateSchedule} className="flex flex-col gap-6">
          <div className="flex flex-wrap items-end gap-4">
            <label className="flex flex-col gap-1 text-sm">
              Hora de inicio
              <input
                type="time"
                name="workDayStart"
                required
                defaultValue={minutesToTimeInput(professional.workDayStartMinutes)}
                className="border border-line px-3 py-2 focus:border-ink focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              Hora de fin
              <input
                type="time"
                name="workDayEnd"
                required
                defaultValue={minutesToTimeInput(professional.workDayEndMinutes)}
                className="border border-line px-3 py-2 focus:border-ink focus:outline-none"
              />
            </label>
          </div>

          <div className="flex flex-wrap gap-4">
            {WEEKDAYS.map((day) => (
              <label key={day.value} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="dayOff"
                  value={day.value}
                  defaultChecked={professional.daysOff.includes(day.value)}
                  className="h-4 w-4 border-line"
                />
                {day.label}
              </label>
            ))}
          </div>
          <button
            type="submit"
            className="self-start border border-ink bg-ink px-6 py-2 text-sm font-medium uppercase tracking-wide text-white transition hover:bg-paper hover:text-ink"
          >
            Guardar
          </button>
        </form>
      </section>
    </div>
  );
}
