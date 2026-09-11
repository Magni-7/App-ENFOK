import Link from "next/link";

type Category = { slug: string; name: string };

type CategoryChipsProps = {
  categories: Category[];
  activeSlug?: string;
};

export default function CategoryChips({ categories, activeSlug }: CategoryChipsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href="/catalogue"
        className={`rounded-full border px-4 py-2 text-sm transition ${
          !activeSlug ? "border-clay bg-clay text-white" : "border-line hover:border-clay"
        }`}
      >
        Todos los estilos
      </Link>
      {categories.map((category) => (
        <Link
          key={category.slug}
          href={`/catalogue?categorie=${category.slug}`}
          className={`rounded-full border px-4 py-2 text-sm transition ${
            activeSlug === category.slug ? "border-clay bg-clay text-white" : "border-line hover:border-clay"
          }`}
        >
          {category.name}
        </Link>
      ))}
    </div>
  );
}
