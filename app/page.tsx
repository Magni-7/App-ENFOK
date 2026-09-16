import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getProfessionalRatingSummary } from "@/lib/reviews";
import SalonCard from "@/components/SalonCard";
import StarRating from "@/components/StarRating";
import StyleThumb from "@/components/StyleThumb";

// Les données (professionnels, styles) changent en base y no deben quedar
// fijadas al build: renderizado bajo demanda en lugar de estático.
export const dynamic = "force-dynamic";

// Repli tant qu'aucun style réservable n'est publié (cas d'Eva actuellement) :
// montre quelques photos déjà publiées dans la galería (voir /galeria/legado).
const FALLBACK_LEGACY_COUNT = 12;
const fallbackLegacyPhotos = Array.from({ length: FALLBACK_LEGACY_COUNT }, (_, i) => ({
  index: i + 1,
  src: `/images/gallery/eva/eva-${String(i + 1).padStart(2, "0")}.jpg`,
}));

export default async function HomePage() {
  const professionals = await prisma.professional.findMany({
    include: { salons: { orderBy: { order: "asc" }, take: 1 } },
    orderBy: { createdAt: "asc" },
  });
  const professionalsWithSalon = professionals.filter((p) => p.salons.length > 0);

  const [ratingSummaries, recentStyles, globalRatingSummary] = await Promise.all([
    Promise.all(
      professionalsWithSalon.map((p) => getProfessionalRatingSummary(p.id))
    ),
    prisma.style.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      take: 12,
      include: { photos: { orderBy: { order: "asc" }, take: 1 } },
    }),
    prisma.review.aggregate({ _avg: { rating: true }, _count: true }),
  ]);

  return (
    <div className="flex flex-col gap-12">
      <section className="text-center">
        <p className="font-mono text-xs uppercase tracking-[0.15em] text-clay">Trenzame · Barcelona</p>
        <h1 className="mt-2 text-balance font-serif text-4xl font-semibold tracking-tight">
          Cada <em className="text-clay not-italic">trenza</em>, un plan.
        </h1>
        <p className="mx-auto mt-3 max-w-md text-ink/70">
          Reserva tu cita de trenzas con profesionales verificadas en Barcelona.
        </p>
        <Link
          href="/catalogue"
          className="mt-6 inline-block border border-ink bg-ink px-8 py-3 text-sm font-medium uppercase tracking-wide text-white transition hover:bg-paper hover:text-ink"
        >
          Reservar una trenza
        </Link>
        {globalRatingSummary._count > 0 && (
          <div className="mt-6 flex justify-center">
            <StarRating rating={globalRatingSummary._avg.rating ?? 0} count={globalRatingSummary._count} />
          </div>
        )}
      </section>

      {professionalsWithSalon.length > 0 && (
        <section>
          <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-ink/60">
            Nuestros salones
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {professionalsWithSalon.map((professional, index) => {
              const salon = professional.salons[0]!;
              const ratingSummary = ratingSummaries[index]!;
              return (
                <SalonCard
                  key={professional.id}
                  professionalSlug={professional.slug}
                  name={salon.name}
                  photoUrl={salon.photoUrl}
                  address={salon.address}
                  rating={ratingSummary.average}
                  reviewCount={ratingSummary.count}
                />
              );
            })}
          </div>
        </section>
      )}

      {recentStyles.length > 0 ? (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-mono text-xs uppercase tracking-widest text-ink/60">Modelos</h2>
            <Link href="/catalogue" className="text-sm underline underline-offset-4 hover:no-underline">
              Ver todo
            </Link>
          </div>
          <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
            {recentStyles.map((style) => {
              const photo = style.photos[0];
              if (!photo) return null;
              return (
                <StyleThumb
                  key={style.id}
                  id={style.id}
                  name={style.name}
                  photoUrl={photo.url}
                  basePriceCents={style.basePriceCents}
                />
              );
            })}
          </div>
        </section>
      ) : (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-mono text-xs uppercase tracking-widest text-ink/60">Modelos</h2>
            <Link href="/galeria" className="text-sm underline underline-offset-4 hover:no-underline">
              Ver todo
            </Link>
          </div>
          <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
            {fallbackLegacyPhotos.map((photo) => (
              <Link key={photo.index} href={`/galeria/legado/${photo.index}`} className="group w-28 shrink-0 sm:w-32">
                <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-line bg-ink">
                  <Image
                    src={photo.src}
                    alt="Trabajo de trenzas realizado por Eva"
                    fill
                    className="object-cover transition duration-300 group-hover:scale-105"
                    sizes="128px"
                  />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
