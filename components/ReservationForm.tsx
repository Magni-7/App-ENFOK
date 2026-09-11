"use client";

import { useMemo, useState } from "react";

type SlotOption = {
  id: string;
  startAt: string;
};

type ReservationFormProps = {
  styleId: string;
  slots: SlotOption[];
  createBooking: (formData: FormData) => void;
};

const WEEKDAY_LABELS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

const monthFormatter = new Intl.DateTimeFormat("es-ES", { month: "long", year: "numeric" });
const timeFormatter = new Intl.DateTimeFormat("es-ES", { hour: "2-digit", minute: "2-digit" });

function dayKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function monthKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth()}`;
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export default function ReservationForm({ styleId, slots, createBooking }: ReservationFormProps) {
  const parsedSlots = useMemo(
    () =>
      slots
        .map((slot) => ({ ...slot, date: new Date(slot.startAt) }))
        .sort((a, b) => a.date.getTime() - b.date.getTime()),
    [slots]
  );

  const slotsByDay = useMemo(() => {
    const map = new Map<string, typeof parsedSlots>();
    for (const slot of parsedSlots) {
      const key = dayKey(slot.date);
      const existing = map.get(key);
      if (existing) existing.push(slot);
      else map.set(key, [slot]);
    }
    return map;
  }, [parsedSlots]);

  const firstSlotDate = parsedSlots[0]?.date ?? new Date();
  const lastSlotDate = parsedSlots[parsedSlots.length - 1]?.date ?? firstSlotDate;

  const [viewedMonth, setViewedMonth] = useState(() => startOfMonth(firstSlotDate));
  const [selectedDayKey, setSelectedDayKey] = useState<string | null>(() => dayKey(firstSlotDate));
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

  const canGoPrev = monthKey(viewedMonth) > monthKey(startOfMonth(firstSlotDate));
  const canGoNext = monthKey(viewedMonth) < monthKey(startOfMonth(lastSlotDate));

  const calendarCells = useMemo(() => {
    const year = viewedMonth.getFullYear();
    const month = viewedMonth.getMonth();
    const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7; // Lundi = 0
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells: (Date | null)[] = [];
    for (let i = 0; i < firstWeekday; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
    return cells;
  }, [viewedMonth]);

  const selectedDaySlots = selectedDayKey ? slotsByDay.get(selectedDayKey) ?? [] : [];

  return (
    <form action={createBooking} className="flex flex-col gap-8">
      <input type="hidden" name="styleId" value={styleId} />
      <input type="hidden" name="slotId" value={selectedSlotId ?? ""} />

      <fieldset className="flex flex-col gap-4">
        <legend className="mb-2 text-sm uppercase tracking-widest text-ink/60">
          1. Elige un horario
        </legend>

        <div className="flex items-center justify-between">
          <p className="text-sm font-medium capitalize">{monthFormatter.format(viewedMonth)}</p>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={!canGoPrev}
              onClick={() => setViewedMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1))}
              className="flex h-8 w-8 items-center justify-center border border-line text-sm transition hover:border-ink disabled:cursor-not-allowed disabled:opacity-30"
              aria-label="Mes anterior"
            >
              ‹
            </button>
            <button
              type="button"
              disabled={!canGoNext}
              onClick={() => setViewedMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1))}
              className="flex h-8 w-8 items-center justify-center border border-line text-sm transition hover:border-ink disabled:cursor-not-allowed disabled:opacity-30"
              aria-label="Mes siguiente"
            >
              ›
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs uppercase tracking-wide text-ink/50">
          {WEEKDAY_LABELS.map((label) => (
            <div key={label}>{label}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {calendarCells.map((day, i) => {
            if (!day) return <div key={`empty-${i}`} />;
            const key = dayKey(day);
            const hasSlots = slotsByDay.has(key);
            const isSelected = key === selectedDayKey;
            return (
              <button
                key={key}
                type="button"
                disabled={!hasSlots}
                onClick={() => {
                  setSelectedDayKey(key);
                  setSelectedSlotId(null);
                }}
                className={`flex aspect-square flex-col items-center justify-center gap-1 border text-sm transition ${
                  isSelected
                    ? "border-ink bg-ink text-white"
                    : hasSlots
                      ? "border-line hover:border-ink"
                      : "border-transparent text-ink/25"
                }`}
              >
                <span>{day.getDate()}</span>
                {hasSlots && (
                  <span
                    className={`h-1 w-1 rounded-full ${isSelected ? "bg-white" : "bg-ink/50"}`}
                  />
                )}
              </button>
            );
          })}
        </div>

        {selectedDaySlots.length > 0 && (
          <div className="flex flex-wrap gap-2 border-t border-line pt-4">
            {selectedDaySlots.map((slot) => (
              <button
                key={slot.id}
                type="button"
                onClick={() => setSelectedSlotId(slot.id)}
                className={`border px-4 py-2 text-sm transition ${
                  selectedSlotId === slot.id
                    ? "border-ink bg-ink text-white"
                    : "border-line hover:border-ink"
                }`}
              >
                {timeFormatter.format(slot.date)}
              </button>
            ))}
          </div>
        )}
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
        disabled={!selectedSlotId}
        className="border border-ink bg-ink px-6 py-3 text-sm font-medium uppercase tracking-wide text-white transition hover:bg-white hover:text-ink disabled:cursor-not-allowed disabled:border-line disabled:bg-line disabled:text-ink/40 disabled:hover:bg-line disabled:hover:text-ink/40"
      >
        {selectedSlotId ? "Confirmar la cita" : "Elige un horario para continuar"}
      </button>
    </form>
  );
}
