"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type ReservationFormProps = {
  styleId: string;
  durationLabel: string;
  priceLabel: string;
  starts: string[];
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

function isPastDay(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date.getTime() < today.getTime();
}

export default function ReservationForm({
  styleId,
  durationLabel,
  priceLabel,
  starts,
  createBooking,
}: ReservationFormProps) {
  const parsedStarts = useMemo(
    () => starts.map((iso) => new Date(iso)).sort((a, b) => a.getTime() - b.getTime()),
    [starts]
  );

  const startsByDay = useMemo(() => {
    const map = new Map<string, Date[]>();
    for (const date of parsedStarts) {
      const key = dayKey(date);
      const existing = map.get(key);
      if (existing) existing.push(date);
      else map.set(key, [date]);
    }
    return map;
  }, [parsedStarts]);

  const firstDate = parsedStarts[0] ?? new Date();
  const lastDate = parsedStarts[parsedStarts.length - 1] ?? firstDate;

  const [viewedMonth, setViewedMonth] = useState(() => startOfMonth(firstDate));
  const [selectedDayKey, setSelectedDayKey] = useState<string | null>(() => dayKey(firstDate));
  const [selectedStart, setSelectedStart] = useState<Date | null>(null);

  const canGoPrev = monthKey(viewedMonth) > monthKey(startOfMonth(firstDate));
  const canGoNext = monthKey(viewedMonth) < monthKey(startOfMonth(lastDate));

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

  const selectedDayStarts = selectedDayKey ? startsByDay.get(selectedDayKey) ?? [] : [];

  return (
    <form action={createBooking} className="flex flex-col gap-8">
      <input type="hidden" name="styleId" value={styleId} />
      <input type="hidden" name="startAt" value={selectedStart ? selectedStart.toISOString() : ""} />

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
              className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-sm transition hover:border-ink disabled:cursor-not-allowed disabled:opacity-30"
              aria-label="Mes anterior"
            >
              ‹
            </button>
            <button
              type="button"
              disabled={!canGoNext}
              onClick={() => setViewedMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1))}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-sm transition hover:border-ink disabled:cursor-not-allowed disabled:opacity-30"
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
            const hasStarts = (startsByDay.get(key) ?? []).length > 0;
            const isSelected = key === selectedDayKey;
            const past = isPastDay(day);
            return (
              <button
                key={key}
                type="button"
                disabled={!hasStarts}
                onClick={() => {
                  setSelectedDayKey(key);
                  setSelectedStart(null);
                }}
                className={`flex aspect-square flex-col items-center justify-center gap-1 rounded-full border text-sm transition ${
                  isSelected
                    ? "border-ink bg-ink text-white"
                    : hasStarts
                      ? "border-line hover:border-ink"
                      : `border-transparent text-ink/25 ${past ? "line-through" : ""}`
                }`}
              >
                <span>{day.getDate()}</span>
                {hasStarts && (
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${isSelected ? "bg-white" : "bg-fern"}`}
                  />
                )}
              </button>
            );
          })}
        </div>

        {selectedDayStarts.length > 0 && (
          <div className="flex flex-wrap gap-2 border-t border-line pt-4">
            {selectedDayStarts.map((start) => (
              <button
                key={start.toISOString()}
                type="button"
                onClick={() => setSelectedStart(start)}
                className={`rounded-full border px-5 py-2.5 text-sm font-medium transition ${
                  selectedStart?.getTime() === start.getTime()
                    ? "border-ink bg-ink text-white"
                    : "border-line hover:border-ink"
                }`}
              >
                <span className="font-mono">{timeFormatter.format(start)}</span>
              </button>
            ))}
          </div>
        )}

        {selectedStart && (
          <div className="flex items-center justify-between gap-4 border-t border-line pt-4">
            <div className="text-sm">
              <p className="text-ink/60">1 prestación · <span className="font-mono">{durationLabel}</span></p>
              <p className="font-mono text-lg font-semibold text-clay">{priceLabel}</p>
            </div>
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
        disabled={!selectedStart}
        className="border border-ink bg-ink px-6 py-3 text-sm font-medium uppercase tracking-wide text-white transition hover:bg-paper hover:text-ink disabled:cursor-not-allowed disabled:border-line disabled:bg-line disabled:text-ink/40 disabled:hover:bg-line disabled:hover:text-ink/40"
      >
        {selectedStart ? "Confirmar la cita" : "Elige un horario para continuar"}
      </button>

      <p className="text-center text-xs text-ink/50">
        Para gestionar tu cita, tus datos se comparten únicamente con Eva. Más información en la{" "}
        <Link href="/privacidad" className="underline underline-offset-4 hover:no-underline">
          política de privacidad
        </Link>
        .
      </p>
    </form>
  );
}
