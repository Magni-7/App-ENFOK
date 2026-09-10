export function formatPriceFrom(basePriceCents: number): string {
  const euros = basePriceCents / 100;
  const formatted = euros % 1 === 0 ? euros.toFixed(0) : euros.toFixed(2);
  return `à partir de ${formatted}€`;
}

export function formatDuration(durationMinutes: number): string {
  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;
  if (hours === 0) return `${minutes} min`;
  if (minutes === 0) return `${hours} h`;
  return `${hours} h ${minutes}`;
}

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

const timeFormatter = new Intl.DateTimeFormat("fr-FR", {
  hour: "2-digit",
  minute: "2-digit",
});

export function formatSlotDate(date: Date): string {
  const formatted = dateFormatter.format(date);
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

export function formatSlotTime(date: Date): string {
  return timeFormatter.format(date);
}

export function formatHairProvider(hairProvidedBy: string): string {
  return hairProvidedBy === "PROFESSIONAL" ? "Mèches fournies par Eva" : "Mèches fournies par la cliente";
}
