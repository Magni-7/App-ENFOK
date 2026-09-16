import Image from "next/image";
import Link from "next/link";
import { formatDuration, formatPriceFrom } from "@/lib/format";

// Une fiche reste "Nuevo" pendant les 14 premiers jours après sa publication.
const NEW_BADGE_DAYS = 14;

type StyleCardProps = {
  id: string;
  name: string;
  photoUrl: string;
  basePriceCents: number;
  durationMinutes: number;
  minHairLength: string;
  createdAt: string | Date;
  professionalName?: string;
  isPopular?: boolean;
};

export default function StyleCard({
  id,
  name,
  photoUrl,
  basePriceCents,
  durationMinutes,
  minHairLength,
  createdAt,
  professionalName,
  isPopular,
}: StyleCardProps) {
  const isNew = Date.now() - new Date(createdAt).getTime() < NEW_BADGE_DAYS * 24 * 60 * 60 * 1000;

  return (
    <Link
      href={`/styles/${id}`}
      className="group block overflow-hidden rounded-2xl border border-line transition hover:border-clay"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-ink">
        <Image
          src={photoUrl}
          alt={name}
          fill
          className="object-cover transition duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, 33vw"
        />
        <div className="absolute left-2 top-2 flex flex-col items-start gap-1">
          {isNew && (
            <span className="rounded-full bg-fern px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-white">
              Nuevo
            </span>
          )}
          {isPopular && (
            <span className="rounded-full bg-miel-bg px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wide text-[#7a5620]">
              ★ Popular
            </span>
          )}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-serif text-base font-medium">{name}</h3>
        {professionalName && <p className="mt-0.5 text-xs text-ink/60">{professionalName}</p>}
        <p className="mt-1 font-mono text-xs text-ink/70">
          {formatPriceFrom(basePriceCents)} · {formatDuration(durationMinutes)}
        </p>
        <span className="mt-2 inline-block border border-line bg-mist px-2 py-0.5 text-[11px] text-ink/70">
          ⚠ {minHairLength}
        </span>
      </div>
    </Link>
  );
}
