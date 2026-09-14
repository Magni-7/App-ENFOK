import Image from "next/image";
import Link from "next/link";
import StarRating from "./StarRating";

type SalonCardProps = {
  professionalSlug: string;
  name: string;
  photoUrl: string;
  address?: string | null;
  rating: number;
};

export default function SalonCard({ professionalSlug, name, photoUrl, address, rating }: SalonCardProps) {
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
        <StarRating rating={rating} className="mt-2" />
      </div>
    </Link>
  );
}
