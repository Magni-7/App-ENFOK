import Link from "next/link";

type Salon = { slug: string; displayName: string };

type SalonChipsProps = {
  salons: Salon[];
  activeSlug?: string;
};

export default function SalonChips({ salons, activeSlug }: SalonChipsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href="/catalogue"
        className={`rounded-full border px-4 py-2 text-sm transition ${
          !activeSlug ? "border-clay bg-clay text-white" : "border-line hover:border-clay"
        }`}
      >
        Todos los salones
      </Link>
      {salons.map((salon) => (
        <Link
          key={salon.slug}
          href={`/catalogue?salon=${salon.slug}`}
          className={`rounded-full border px-4 py-2 text-sm transition ${
            activeSlug === salon.slug ? "border-clay bg-clay text-white" : "border-line hover:border-clay"
          }`}
        >
          {salon.displayName}
        </Link>
      ))}
    </div>
  );
}
