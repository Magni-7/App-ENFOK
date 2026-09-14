"use client";

import { useRouter, useSearchParams } from "next/navigation";

const OPTIONS = [
  { value: "", label: "Más recientes" },
  { value: "precio_asc", label: "Precio: menor a mayor" },
  { value: "precio_desc", label: "Precio: mayor a menor" },
  { value: "duracion_asc", label: "Duración: menor a mayor" },
] as const;

export default function SortSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(searchParams.toString());
    if (event.target.value) {
      params.set("sort", event.target.value);
    } else {
      params.delete("sort");
    }
    router.push(`/catalogue?${params.toString()}`);
  }

  return (
    <label className="flex items-center gap-2 text-sm text-ink/70">
      Ordenar por
      <select
        defaultValue={searchParams.get("sort") ?? ""}
        onChange={handleChange}
        className="border border-line bg-paper px-3 py-2 text-ink focus:border-ink focus:outline-none"
      >
        {OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
