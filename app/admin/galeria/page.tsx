import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireProfessional } from "@/lib/professional";
import { formatDuration, formatPriceFrom } from "@/lib/format";
import {
  createCategory,
  createGalleryItem,
  deleteGalleryItem,
  toggleGalleryItemActive,
  toggleGalleryItemPopular,
} from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminGaleriaPage() {
  const professional = await requireProfessional();

  const [categories, styles] = await Promise.all([
    prisma.category.findMany({
      where: { professionalId: professional.id },
      orderBy: { order: "asc" },
    }),
    prisma.style.findMany({
      where: { professionalId: professional.id },
      include: { photos: { orderBy: { order: "asc" }, take: 1 }, category: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="flex flex-col gap-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Galería — {professional.displayName}</h1>
        <Link href="/admin" className="text-sm text-ink/60 underline underline-offset-4 hover:text-ink">
          ← Volver a la agenda
        </Link>
      </div>

      <section className="border-b border-line pb-10">
        <h2 className="mb-1 text-sm uppercase tracking-widest text-ink/60">Categorías</h2>
        <p className="mb-4 text-sm text-ink/60">
          Agrupa tus estilos como quieras (ej. Clásicas, Diseños) — aparecen como filtros en el
          catálogo y como secciones en la página de inicio.
        </p>
        {categories.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {categories.map((category) => (
              <span
                key={category.id}
                className="rounded-full border border-line px-4 py-1.5 text-sm text-ink/80"
              >
                {category.name}
              </span>
            ))}
          </div>
        )}
        <form action={createCategory} className="flex flex-wrap items-end gap-3">
          <label className="flex flex-col gap-1 text-sm">
            Nueva categoría
            <input
              type="text"
              name="name"
              required
              placeholder="Ej. Diseños"
              className="w-56 border border-line px-3 py-2 focus:border-ink focus:outline-none"
            />
          </label>
          <button
            type="submit"
            className="border border-ink px-4 py-2 text-sm font-medium uppercase tracking-wide transition hover:bg-ink hover:text-white"
          >
            Añadir
          </button>
        </form>
      </section>

      <section className="border-b border-line pb-10">
        <h2 className="mb-1 text-sm uppercase tracking-widest text-ink/60">Añadir una foto</h2>
        <p className="mb-4 text-sm text-ink/60">
          Sube una o varias fotos de un trabajo real (antes/después, distintos ángulos). Rellena
          el precio, la duración y la longitud de pelo mínima: esta información aparecerá en la
          ficha y permitirá a las clientas reservar directamente desde la galería.
        </p>

        {categories.length === 0 ? (
          <p className="text-sm text-red-600">
            No hay categorías configuradas todavía. Créala primero en "Categorías" más abajo.
          </p>
        ) : (
          <form action={createGalleryItem} className="flex flex-col gap-4" encType="multipart/form-data">
            <label className="flex flex-col gap-1 text-sm">
              Fotos (puedes seleccionar varias)
              <input
                type="file"
                name="photos"
                accept="image/*"
                required
                multiple
                className="border border-line px-3 py-2 focus:border-ink focus:outline-none"
              />
            </label>

            <label className="flex flex-col gap-1 text-sm">
              Nombre del estilo
              <input
                type="text"
                name="name"
                required
                placeholder="Ej. Box Braids largas"
                className="border border-line px-3 py-2 focus:border-ink focus:outline-none"
              />
            </label>

            <label className="flex flex-col gap-1 text-sm">
              Categoría
              <select
                name="categoryId"
                required
                defaultValue={categories[0]?.id}
                className="border border-line bg-paper px-3 py-2 focus:border-ink focus:outline-none"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1 text-sm">
              Descripción (opcional)
              <textarea
                name="description"
                rows={2}
                className="border border-line px-3 py-2 focus:border-ink focus:outline-none"
              />
            </label>

            <div className="flex flex-wrap items-end gap-4">
              <label className="flex flex-col gap-1 text-sm">
                Precio (€)
                <input
                  type="number"
                  name="priceEuros"
                  required
                  min="1"
                  step="0.01"
                  placeholder="120"
                  className="w-32 border border-line px-3 py-2 focus:border-ink focus:outline-none"
                />
              </label>

              <label className="flex flex-col gap-1 text-sm">
                Duración — horas
                <input
                  type="number"
                  name="durationHours"
                  min="0"
                  defaultValue={0}
                  className="w-24 border border-line px-3 py-2 focus:border-ink focus:outline-none"
                />
              </label>

              <label className="flex flex-col gap-1 text-sm">
                Duración — minutos
                <input
                  type="number"
                  name="durationMinutes"
                  min="0"
                  max="59"
                  defaultValue={0}
                  className="w-24 border border-line px-3 py-2 focus:border-ink focus:outline-none"
                />
              </label>
            </div>

            <label className="flex flex-col gap-1 text-sm">
              Longitud de pelo mínima
              <input
                type="text"
                name="minHairLength"
                required
                placeholder="Ej. Mínimo hombro"
                className="border border-line px-3 py-2 focus:border-ink focus:outline-none"
              />
            </label>

            <label className="flex flex-col gap-1 text-sm">
              Extensiones
              <select
                name="hairProvidedBy"
                defaultValue="CLIENT"
                className="border border-line bg-paper px-3 py-2 focus:border-ink focus:outline-none"
              >
                <option value="CLIENT">A cargo de la clienta</option>
                <option value="PROFESSIONAL">A cargo de {professional.displayName}</option>
              </select>
            </label>

            <button
              type="submit"
              className="self-start border border-ink bg-ink px-6 py-2 text-sm font-medium uppercase tracking-wide text-white transition hover:bg-paper hover:text-ink"
            >
              Publicar en la galería
            </button>
          </form>
        )}
      </section>

      <section>
        <h2 className="mb-4 text-sm uppercase tracking-widest text-ink/60">
          Fotos publicadas ({styles.length})
        </h2>
        {styles.length === 0 ? (
          <p className="text-sm text-ink/60">Todavía no has añadido ninguna foto.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {styles.map((style) => (
              <div key={style.id} className="flex gap-4 border border-line p-3">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden bg-ink">
                  {style.photos[0] && (
                    <Image
                      src={style.photos[0].url}
                      alt={style.name}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  )}
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <p className="font-medium">{style.name}</p>
                    <p className="text-xs text-ink/60">{style.category.name}</p>
                    <p className="mt-1 font-mono text-xs text-ink/70">
                      {formatPriceFrom(style.basePriceCents)} · {formatDuration(style.durationMinutes)}
                    </p>
                    {!style.isActive && (
                      <p className="mt-1 text-xs font-medium uppercase tracking-wide text-red-600">
                        Oculta
                      </p>
                    )}
                    {style.isPopular && (
                      <p className="mt-1 text-xs font-medium uppercase tracking-wide text-miel">
                        ★ Popular
                      </p>
                    )}
                  </div>
                  <div className="mt-2 flex gap-3 text-xs">
                    <form action={toggleGalleryItemActive}>
                      <input type="hidden" name="styleId" value={style.id} />
                      <button type="submit" className="underline underline-offset-4 hover:text-ink">
                        {style.isActive ? "Ocultar" : "Publicar"}
                      </button>
                    </form>
                    <form action={toggleGalleryItemPopular}>
                      <input type="hidden" name="styleId" value={style.id} />
                      <button type="submit" className="underline underline-offset-4 hover:text-ink">
                        {style.isPopular ? "Quitar de Popular" : "Marcar como Popular"}
                      </button>
                    </form>
                    <form action={deleteGalleryItem}>
                      <input type="hidden" name="styleId" value={style.id} />
                      <button type="submit" className="text-red-600 underline underline-offset-4 hover:text-red-800">
                        Eliminar
                      </button>
                    </form>
                    <Link href={`/styles/${style.id}`} className="underline underline-offset-4 hover:text-ink">
                      Ver ficha
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
