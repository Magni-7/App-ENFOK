import Image from "next/image";
import Link from "next/link";
import StarRating from "./StarRating";

type SalonCardProps = {
  professionalSlug: string;
  name: string;
  photoUrl: string;
  address?: string | null;
  rating: number;
  reviewCount: number;
};

export default function SalonCard({
  professionalSlug,
  name,
  photoUrl,
  address,
  rating,
  reviewCount,
}: SalonCardProps) {
  return (
    <Link
      href={`/profesionales/${professionalSlug}`}
      className="group block overflow-hidden rounded-2xl border border-line transition hover:border-clay"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-ink">
        <Image
          src={photoUrl}
          alt={name}
          fill
          className="object-cover transition duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, 480px"
        />
      </div>
      <div className="p-4">
        <h3 className="font-serif text-base font-medium">{name}</h3>
        {address && <p className="mt-1 text-xs text-ink/60">{address}</p>}
        {reviewCount > 0 ? (
          <StarRating rating={rating} count={reviewCount} className="mt-2" />
        ) : (
          <span className="mt-2 inline-block rounded-full border border-clay/40 px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-wide text-clay">
            Nuevo
          </span>
        )}
      </div>
    </Link>
  );
}
