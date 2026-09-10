import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatDuration, formatHairProvider, formatPriceFrom } from "@/lib/format";
import ContactButton from "@/components/ContactButton";

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

  const photoUrl = style.photos[0]?.url ?? "/images/placeholder-style.svg";

  return (
    <div className="flex flex-col gap-8">
      <Link href="/catalogue" className="text-sm text-ink/60 hover:text-ink">
        ← Retour au catalogue
      </Link>

      <div className="relative aspect-[4/3] w-full overflow-hidden border border-line bg-ink">
        <Image src={photoUrl} alt={style.name} fill className="object-cover" sizes="100vw" priority />
      </div>

      <div>
        <p className="text-xs uppercase tracking-widest text-ink/50">{style.category.name}</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">{style.name}</h1>
        {style.description && <p className="mt-3 text-ink/80">{style.description}</p>}
      </div>

      <dl className="grid grid-cols-2 gap-4 border-y border-line py-6 text-sm sm:grid-cols-4">
        <div>
          <dt className="text-ink/50">Prix</dt>
          <dd className="mt-1 font-medium">{formatPriceFrom(style.basePriceCents)}</dd>
        </div>
        <div>
          <dt className="text-ink/50">Durée estimée</dt>
          <dd className="mt-1 font-medium">{formatDuration(style.durationMinutes)}</dd>
        </div>
        <div>
          <dt className="text-ink/50">Longueur minimale</dt>
          <dd className="mt-1 font-medium">{style.minHairLength}</dd>
        </div>
        <div>
          <dt className="text-ink/50">Mèches</dt>
          <dd className="mt-1 font-medium">{formatHairProvider(style.hairProvidedBy)}</dd>
        </div>
      </dl>

      <Link
        href={`/reserver/${style.id}`}
        className="inline-flex items-center justify-center border border-ink bg-ink px-6 py-3 text-center text-sm font-medium uppercase tracking-wide text-white transition hover:bg-white hover:text-ink"
      >
        Réserver ce style
      </Link>

      <div className="border-t border-line pt-6">
        <p className="mb-3 text-sm text-ink/70">Vous préférez une variante personnalisée de ce style ?</p>
        <ContactButton
          whatsappNumber={style.professional.whatsappNumber}
          instagramUsername={style.professional.instagramDmUsername}
          message={`Bonjour Eva ! Je suis intéressée par une variante personnalisée du style "${style.name}".`}
        />
      </div>
    </div>
  );
}
