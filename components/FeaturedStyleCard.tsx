import Image from "next/image";
import Link from "next/link";
import { formatDuration, formatPriceFrom } from "@/lib/format";

type FeaturedStyleCardProps = {
  id: string;
  name: string;
  photoUrl: string;
  basePriceCents: number;
  durationMinutes: number;
};

export default function FeaturedStyleCard({
  id,
  name,
  photoUrl,
  basePriceCents,
  durationMinutes,
}: FeaturedStyleCardProps) {
  return (
    <Link
      href={`/styles/${id}`}
      className="group relative block aspect-[3/4] w-52 shrink-0 overflow-hidden rounded-2xl border border-line"
    >
      <Image
        src={photoUrl}
        alt={name}
        fill
        className="object-cover transition duration-300 group-hover:scale-105"
        sizes="208px"
      />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/85 via-ink/30 to-transparent p-4 pt-12">
        <p className="text-sm font-medium text-white">{name}</p>
        <p className="mt-1 text-xs text-white/80">
          {formatPriceFrom(basePriceCents)} · {formatDuration(durationMinutes)}
        </p>
      </div>
      <span className="absolute right-3 top-3 rounded-full bg-clay px-3 py-1 text-xs font-medium uppercase tracking-wide text-white">
        Reservar
      </span>
    </Link>
  );
}
