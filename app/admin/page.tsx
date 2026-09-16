import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { requireProfessional } from "@/lib/professional";
import { formatSlotDate, formatSlotTime } from "@/lib/format";
import { updateSchedule, updateSalonPhoto, createSalon, logout } from "./actions";

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
  const professional = await requireProfessional();

  const salons = await prisma.salon.findMany({
    where: { professionalId: professional.id },
    orderBy: { order: "asc" },
  });

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
          <Link href="/admin/clientas" className="text-sm underline underline-offset-4 hover:text-ink">
            Mis clientas
          </Link>
          <Link href="/admin/detalles" className="text-sm underline underline-offset-4 hover:text-ink">
            Detalles de la cuenta
          </Link>
          <form action={logout}>
            <button type="submit" className="text-sm text-ink/60 underline underline-offset-4 hover:text-ink">
              Cerrar sesión
            </button>
          </form>
        </div>
      </div>

      {salons.length > 0 && (
        <section className="border-t border-line pt-8">
          <h2 className="mb-4 text-sm uppercase tracking-widest text-ink/60">Tu salón</h2>
          <div className="flex flex-col gap-6 sm:flex-row sm:flex-wrap">
            {salons.map((salon) => (
              <div key={salon.id} className="flex flex-col gap-3 sm:w-72">
                <div className="relative aspect-[16/9] w-full overflow-hidden border border-line bg-ink">
                  <Image src={salon.photoUrl} alt={salon.name} fill className="object-cover" sizes="288px" />
                </div>
                <div>
                  <p className="font-medium">{salon.name}</p>
                  {salon.address && <p className="text-sm text-ink/60">{salon.address}</p>}
                </div>
                <form
                  action={updateSalonPhoto}
                  encType="multipart/form-data"
                  className="flex items-center gap-3 text-sm"
                >
                  <input type="hidden" name="salonId" value={salon.id} />
                  <label
                    htmlFor={`salon-photo-${salon.id}`}
                    className="cursor-pointer underline underline-offset-4 hover:text-ink"
                  >
                    Elegir foto
                  </label>
                  <input
                    id={`salon-photo-${salon.id}`}
                    type="file"
                    name="photo"
                    accept="image/*"
                    required
                    className="hidden"
                  />
                  <button
                    type="submit"
                    className="border border-line px-3 py-1.5 text-xs uppercase tracking-wide hover:border-ink"
                  >
                    Guardar foto
                  </button>
                </form>
              </div>
            ))}
          </div>
        </section>
      )}

      {salons.length === 0 && (
        <section className="border-t border-line pt-8">
          <h2 className="mb-1 text-sm uppercase tracking-widest text-ink/60">Tu salón</h2>
          <p className="mb-4 text-sm text-ink/60">
            Todavía no has añadido ningún salón. Añade el lugar donde recibes a tus clientas para
            que aparezca en tu página pública.
          </p>
          <form action={createSalon} encType="multipart/form-data" className="flex flex-col gap-4 sm:max-w-sm">
            <label className="flex flex-col gap-1 text-sm">
              Nombre del salón
              <input
                type="text"
                name="name"
                required
                placeholder="Ej. Trenzame Studio"
                className="border border-line px-3 py-2 focus:border-ink focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              Dirección (opcional)
              <input
                type="text"
                name="address"
                className="border border-line px-3 py-2 focus:border-ink focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              Foto
              <input
                type="file"
                name="photo"
                accept="image/*"
                required
                className="border border-line px-3 py-2 focus:border-ink focus:outline-none"
              />
            </label>
            <button
              type="submit"
              className="self-start border border-ink bg-ink px-6 py-2 text-sm font-medium uppercase tracking-wide text-white transition hover:bg-paper hover:text-ink"
            >
              Crear salón
            </button>
          </form>
        </section>
      )}

      <section className="border-t border-line pt-8">
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
