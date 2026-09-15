import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import CategoryChips from "@/components/CategoryChips";
import SalonChips from "@/components/SalonChips";
import SearchBar from "@/components/SearchBar";
import SortSelect from "@/components/SortSelect";
import StyleCard from "@/components/StyleCard";

type CataloguePageProps = {
  searchParams: Promise<{ salon?: string; categorie?: string; q?: string; sort?: string }>;
};

const SORT_OPTIONS: Record<string, Prisma.StyleOrderByWithRelationInput[]> = {
  precio_asc: [{ basePriceCents: "asc" }],
  precio_desc: [{ basePriceCents: "desc" }],
  duracion_asc: [{ durationMinutes: "asc" }],
};

export default async function CataloguePage({ searchParams }: CataloguePageProps) {
  const { salon, categorie, q, sort } = await searchParams;
  const orderBy = (sort && SORT_OPTIONS[sort]) || [{ createdAt: "desc" as const }];

  const professional = salon
    ? await prisma.professional.findUnique({ where: { slug: salon } })
    : null;

  const [salons, categories, styles] = await Promise.all([
    prisma.professional.findMany({
      select: { slug: true, displayName: true },
      orderBy: { createdAt: "asc" },
    }),
    professional
      ? prisma.category.findMany({
          where: { professionalId: professional.id },
          orderBy: { order: "asc" },
        })
      : Promise.resolve([]),
    prisma.style.findMany({
      where: {
        isActive: true,
        ...(professional ? { professionalId: professional.id } : {}),
        ...(categorie && professional ? { category: { slug: categorie } } : {}),
        ...(q ? { name: { contains: q, mode: "insensitive" } } : {}),
      },
      include: {
        photos: { orderBy: { order: "asc" }, take: 1 },
        professional: { select: { displayName: true } },
      },
      orderBy,
    }),
  ]);

  const activeCategory = categorie && professional
    ? categories.find((c) => c.slug === categorie)
    : undefined;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-serif text-2xl font-semibold tracking-tight">Catálogo de estilos</h1>
        <p className="mt-2 text-sm text-ink/70">
          {q
            ? `Resultados para "${q}"`
            : professional
              ? `Salón: ${professional.displayName}${activeCategory ? ` · ${activeCategory.name}` : ""}`
              : "Todos los estilos disponibles, de todos nuestros salones."}
        </p>
      </div>

      <SearchBar defaultValue={q} salon={salon} categorie={categorie} sort={sort} />

      <SalonChips salons={salons} activeSlug={professional?.slug} />

      {professional && categories.length > 0 && (
        <CategoryChips
          categories={categories.map((c) => ({ slug: c.slug, name: c.name }))}
          activeSlug={activeCategory?.slug}
        />
      )}

      <div className="flex justify-end">
        <SortSelect />
      </div>

      {styles.length === 0 ? (
        <p className="text-sm text-ink/60">
          {q ? `Ningún estilo coincide con "${q}".` : "No hay estilos disponibles con estos filtros por ahora."}
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
              professionalName={professional ? undefined : style.professional.displayName}
            />
          ))}
        </div>
      )}
    </div>
  );
}
