import { prisma } from "@/lib/prisma";
import { getDefaultProfessional } from "@/lib/professional";
import CategoryChips from "@/components/CategoryChips";
import SearchBar from "@/components/SearchBar";
import StyleCard from "@/components/StyleCard";

type CataloguePageProps = {
  searchParams: Promise<{ categorie?: string; q?: string }>;
};

export default async function CataloguePage({ searchParams }: CataloguePageProps) {
  const { categorie, q } = await searchParams;
  const professional = await getDefaultProfessional();
  const categories = await prisma.category.findMany({
    where: { professionalId: professional.id },
    orderBy: { order: "asc" },
  });

  const activeCategory = categorie
    ? categories.find((c) => c.slug === categorie)
    : undefined;

  const styles = await prisma.style.findMany({
    where: {
      professionalId: professional.id,
      isActive: true,
      ...(activeCategory ? { categoryId: activeCategory.id } : {}),
      ...(q ? { name: { contains: q, mode: "insensitive" } } : {}),
    },
    include: { photos: { orderBy: { order: "asc" }, take: 1 } },
    orderBy: [{ categoryId: "asc" }, { order: "asc" }],
  });

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-serif text-2xl font-semibold tracking-tight">Catálogo de estilos</h1>
        <p className="mt-2 text-sm text-ink/70">
          {q
            ? `Resultados para "${q}"`
            : activeCategory
              ? `Categoría: ${activeCategory.name}`
              : "Todos los estilos disponibles."}
        </p>
      </div>

      <SearchBar defaultValue={q} />

      <CategoryChips
        categories={categories.map((c) => ({ slug: c.slug, name: c.name }))}
        activeSlug={activeCategory?.slug}
      />

      {styles.length === 0 ? (
        <p className="text-sm text-ink/60">
          {q ? `Ningún estilo coincide con "${q}".` : "No hay estilos disponibles en esta categoría por ahora."}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {styles.map((style) => (
            <StyleCard
              key={style.id}
              id={style.id}
              name={style.name}
              photoUrl={style.photos[0]?.url ?? "/images/placeholder-style.svg"}
              basePriceCents={style.basePriceCents}
              durationMinutes={style.durationMinutes}
            />
          ))}
        </div>
      )}
    </div>
  );
}
