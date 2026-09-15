import Image from "next/image";
import Link from "next/link";
import { formatPriceFrom } from "@/lib/format";

type StyleThumbProps = {
  id: string;
  name: string;
  photoUrl: string;
  basePriceCents: number;
};

export default function StyleThumb({ id, name, photoUrl, basePriceCents }: StyleThumbProps) {
  return (
    <Link href={`/styles/${id}`} className="group w-28 shrink-0 sm:w-32">
      <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-line bg-ink">
        <Image
          src={photoUrl}
          alt={name}
          fill
          className="object-cover transition duration-300 group-hover:scale-105"
          sizes="128px"
        />
      </div>
      <p className="mt-1.5 truncate text-xs font-medium">{name}</p>
      <p className="font-mono text-[11px] text-ink/60">{formatPriceFrom(basePriceCents)}</p>
    </Link>
  );
}
