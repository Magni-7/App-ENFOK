import Link from "next/link";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import CategoryChips from "@/components/CategoryChips";
import ContactButton from "@/components/ContactButton";
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
        category: { select: { name: true } },
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
        professional && !q ? (
          <div className="flex flex-col items-start gap-4">
            <p className="text-sm text-ink/60">
              {professional.displayName} todavía no ha publicado precios y duraciones. Mientras tanto,
              pregunta directamente:
            </p>
            <ContactButton
              whatsappNumber={professional.whatsappNumber}
              instagramUsername={professional.instagramDmUsername}
              message={`¡Hola ${professional.displayName}! Me interesa reservar una cita, ¿me puedes dar precio y disponibilidad?`}
            />
          </div>
        ) : (
          <div className="flex flex-col items-start gap-3">
            <h2 className="font-serif text-lg font-medium">
              Por aquí no hay trenzas con estos filtros… todavía
            </h2>
            <p className="text-sm text-ink/60">
              Prueba a ampliar los filtros, o descubre los estilos más pedidos del momento.
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-4">
              <Link
                href="/catalogue"
                className="border border-clay px-5 py-2 text-sm font-medium uppercase tracking-wide text-clay transition hover:bg-clay hover:text-white"
              >
                Reiniciar filtros
              </Link>
              <Link href="/galeria" className="text-sm text-clay underline underline-offset-4 hover:no-underline">
                Ver últimas creaciones →
              </Link>
            </div>
          </div>
        )
      ) : professional ? (
        // Vue d'un seul salon : structurée en 2 niveaux, famille de style
        // (catégorie) → variantes, chaque variante gardant son propre
        // prix/durée — au lieu d'une grille plate qui mélange tout.
        <div className="flex flex-col gap-10">
          {Array.from(new Set(styles.map((s) => s.category.name))).map((categoryName) => (
            <div key={categoryName}>
              <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-ink/60">
                {categoryName}
              </h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {styles
                  .filter((s) => s.category.name === categoryName)
                  .map((style) => (
                    <StyleCard
                      key={style.id}
                      id={style.id}
                      name={style.name}
                      photoUrl={style.photos[0]?.url ?? "/images/placeholder-style.svg"}
                      basePriceCents={style.basePriceCents}
                      durationMinutes={style.durationMinutes}
                      minHairLength={style.minHairLength}
                      createdAt={style.createdAt}
                      isPopular={style.isPopular}
                    />
                  ))}
              </div>
            </div>
          ))}
        </div>
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
              minHairLength={style.minHairLength}
              createdAt={style.createdAt}
              isPopular={style.isPopular}
              professionalName={style.professional.displayName}
            />
          ))}
        </div>
      )}
    </div>
  );
}
