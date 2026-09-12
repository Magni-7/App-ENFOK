import type { Metadata } from "next";
import Image from "next/image";
import { getDefaultProfessional } from "@/lib/professional";

export const metadata: Metadata = {
  title: "Galería — Trenzame",
  description: "Trabajos reales de Eva: una selección de trenzas y diseños realizados en el salón.",
};

const PHOTO_COUNT = 27;
const photos = Array.from({ length: PHOTO_COUNT }, (_, i) => `/images/gallery/eva/eva-${String(i + 1).padStart(2, "0")}.jpg`);

export default async function GaleriaPage() {
  const professional = await getDefaultProfessional();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-serif text-2xl font-semibold tracking-tight">{professional.displayName}</h1>
        <p className="mt-2 text-sm text-ink/70">
          {professional.displayName} te acompaña para conseguir un estilo de trenzas preciso, pensado
          para tu longitud de cabello y tu estilo de vida.
        </p>
        <p className="mt-1 text-sm text-ink/50">
          Una selección de trabajos reales. Los estilos del catálogo se irán actualizando
          progresivamente con estas fotos.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {photos.map((src) => (
          <a
            key={src}
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            className="relative block aspect-square overflow-hidden border border-line"
          >
            <Image
              src={src}
              alt="Trabajo de trenzas realizado por Eva"
              fill
              className="object-cover"
              sizes="(min-width: 640px) 33vw, 50vw"
            />
          </a>
        ))}
      </div>
    </div>
  );
}
