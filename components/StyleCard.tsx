import Image from "next/image";
import Link from "next/link";
import { formatDuration, formatPriceFrom } from "@/lib/format";

type StyleCardProps = {
  id: string;
  name: string;
  photoUrl: string;
  basePriceCents: number;
  durationMinutes: number;
  professionalName?: string;
};

export default function StyleCard({
  id,
  name,
  photoUrl,
  basePriceCents,
  durationMinutes,
  professionalName,
}: StyleCardProps) {
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
      </div>
      <div className="p-4">
        <h3 className="font-serif text-base font-medium">{name}</h3>
        {professionalName && <p className="mt-0.5 text-xs text-ink/60">{professionalName}</p>}
        <p className="mt-1 font-mono text-xs text-ink/70">
          {formatPriceFrom(basePriceCents)} · {formatDuration(durationMinutes)}
        </p>
      </div>
    </Link>
  );
}
