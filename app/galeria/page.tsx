import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDuration, formatPriceFrom } from "@/lib/format";

// Contenu lié aux professionnel·les (nom, styles publiés) : ne doit pas être figé au build.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Galería — Trenzame",
  description: "Trabajos reales realizados por nuestras profesionales: precio, duración y reserva directa.",
};

const LEGACY_PHOTO_COUNT = 27;
const legacyPhotos = Array.from(
  { length: LEGACY_PHOTO_COUNT },
  (_, i) => `/images/gallery/eva/eva-${String(i + 1).padStart(2, "0")}.jpg`
);

export default async function GaleriaPage() {
  const styles = await prisma.style.findMany({
    where: { isActive: true },
    include: {
      photos: { orderBy: { order: "asc" }, take: 1 },
      professional: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="font-serif text-2xl font-semibold tracking-tight">Galería</h1>
        <p className="mt-2 text-sm text-ink/70">
          Una selección de trabajos reales de nuestras profesionales. Toca una foto para ver el
          precio, la duración y reservar directamente.
        </p>
      </div>

      {styles.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {styles.map((style) => {
            const photo = style.photos[0];
            if (!photo) return null;
            return (
              <Link
                key={style.id}
                href={`/styles/${style.id}`}
                className="group relative block aspect-square overflow-hidden border border-line"
              >
                <Image
                  src={photo.url}
                  alt={photo.alt ?? style.name}
                  fill
                  className="object-cover transition duration-300 group-hover:scale-105"
                  sizes="(min-width: 640px) 33vw, 50vw"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent p-2 pt-6">
                  <p className="truncate text-xs font-medium text-white">
                    Hecho por {style.professional.displayName}
                  </p>
                  <p className="truncate font-mono text-[11px] text-white/80">
                    {formatPriceFrom(style.basePriceCents)} · {formatDuration(style.durationMinutes)}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <div>
        <h2 className="mb-3 font-mono text-xs uppercase tracking-widest text-ink/60">Más trabajos</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {legacyPhotos.map((src, i) => (
            <Link
              key={src}
              href={`/galeria/legado/${i + 1}`}
              className="group relative block aspect-square overflow-hidden border border-line"
            >
              <Image
                src={src}
                alt="Trabajo de trenzas realizado por Eva"
                fill
                className="object-cover transition duration-300 group-hover:scale-105"
                sizes="(min-width: 640px) 33vw, 50vw"
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
