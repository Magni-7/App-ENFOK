import Image from "next/image";
import Link from "next/link";

type CategoryAvatarProps = {
  slug: string;
  name: string;
  photoUrl: string | null;
};

export default function CategoryAvatar({ slug, name, photoUrl }: CategoryAvatarProps) {
  return (
    <Link href={`/catalogue?categorie=${slug}`} className="group flex w-20 shrink-0 flex-col items-center gap-2">
      <div className="relative h-16 w-16 overflow-hidden rounded-full border border-line bg-mist transition group-hover:border-clay">
        {photoUrl && (
          <Image src={photoUrl} alt={name} fill className="object-cover" sizes="64px" />
        )}
      </div>
      <span className="text-center text-xs text-ink/80">{name}</span>
    </Link>
  );
}
