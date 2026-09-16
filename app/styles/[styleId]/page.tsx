import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatDuration, formatHairProvider, formatPriceFrom } from "@/lib/format";
import { splitStyleName } from "@/lib/styleFamily";
import ContactButton from "@/components/ContactButton";
import PhotoGallery from "@/components/PhotoGallery";

type StylePageProps = {
  params: Promise<{ styleId: string }>;
};

export default async function StylePage({ params }: StylePageProps) {
  const { styleId } = await params;
  const style = await prisma.style.findUnique({
    where: { id: styleId },
    include: {
      photos: { orderBy: { order: "asc" } },
      category: true,
      professional: true,
    },
  });

  if (!style || !style.isActive) {
    notFound();
  }

  const { family, variant } = splitStyleName(style.name);
  const siblingStyles = variant
    ? await prisma.style.findMany({
        where: { professionalId: style.professionalId, isActive: true },
        orderBy: { basePriceCents: "asc" },
      })
    : [];
  const variants = siblingStyles.filter((s) => splitStyleName(s.name).family === family);

  return (
    <div className="flex flex-col gap-8">
      <Link href="/catalogue" className="text-sm text-ink/60 hover:text-ink">
        ← Volver al catálogo
      </Link>

      <PhotoGallery
        photos={style.photos.map((photo) => ({ url: photo.url, alt: photo.alt }))}
        fallbackAlt={style.name}
      />

      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-clay">{style.category.name}</p>
        <h1 className="mt-1 font-serif text-2xl font-semibold tracking-tight">{style.name}</h1>
        <Link href="/" className="mt-2 inline-block text-sm text-ink/60 underline underline-offset-4 hover:text-ink">
          Hecho por {style.professional.displayName}
        </Link>
        {style.description && <p className="mt-3 text-ink/80">{style.description}</p>}
      </div>

      <dl className="grid grid-cols-2 gap-4 border-y border-line py-6 text-sm sm:grid-cols-4">
        <div>
          <dt className="font-mono text-xs uppercase tracking-wide text-ink/50">Precio</dt>
          <dd className="mt-1 font-mono font-medium">{formatPriceFrom(style.basePriceCents)}</dd>
        </div>
        <div>
          <dt className="font-mono text-xs uppercase tracking-wide text-ink/50">Duración estimada</dt>
          <dd className="mt-1 font-mono font-medium">{formatDuration(style.durationMinutes)}</dd>
        </div>
        <div>
          <dt className="font-mono text-xs uppercase tracking-wide text-ink/50">Longitud mínima</dt>
          <dd className="mt-1 font-medium">{style.minHairLength}</dd>
        </div>
        <div>
          <dt className="font-mono text-xs uppercase tracking-wide text-ink/50">Extensiones</dt>
          <dd className="mt-1 font-medium">{formatHairProvider(style.hairProvidedBy)}</dd>
        </div>
      </dl>

      <Link
        href={`/reserver/${style.id}`}
        className="inline-flex items-center justify-center border border-ink bg-ink px-6 py-3 text-center text-sm font-medium uppercase tracking-wide text-white transition hover:bg-paper hover:text-ink"
      >
        Reservar este estilo
      </Link>

      {variants.length > 1 && (
        <div className="border-t border-line pt-6">
          <h2 className="mb-3 font-mono text-xs uppercase tracking-widest text-ink/60">
            Precio por longitud — {family}
          </h2>
          <div className="flex flex-col divide-y divide-line border-y border-line">
            {variants.map((v) => {
              const isCurrent = v.id === style.id;
              return (
                <Link
                  key={v.id}
                  href={`/styles/${v.id}`}
                  className={`flex items-center justify-between gap-4 py-3 text-sm transition ${
                    isCurrent ? "font-medium text-clay" : "text-ink/80 hover:text-clay"
                  }`}
                >
                  <span>{splitStyleName(v.name).variant}</span>
                  <span className="font-mono text-xs">
                    {formatPriceFrom(v.basePriceCents)} · {formatDuration(v.durationMinutes)}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      <div className="border-t border-line pt-6">
        <p className="mb-3 text-sm text-ink/70">¿Prefieres una variante personalizada de este estilo?</p>
        <ContactButton
          whatsappNumber={style.professional.whatsappNumber}
          instagramUsername={style.professional.instagramDmUsername}
          message={`¡Hola ${style.professional.displayName}! Me interesa una variante personalizada del estilo "${style.name}".`}
        />
      </div>
    </div>
  );
}
