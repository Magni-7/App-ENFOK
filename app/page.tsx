import { prisma } from "@/lib/prisma";
import { getDefaultProfessional } from "@/lib/professional";
import { getProfessionalRatingSummary } from "@/lib/reviews";
import SalonCard from "@/components/SalonCard";

// Les données (catégories, styles) changent en base y no deben quedar
// fijadas al build: renderizado bajo demanda en lugar de estático.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const professional = await getDefaultProfessional();

  const [salons, ratingSummary] = await Promise.all([
    prisma.salon.findMany({
      where: { professionalId: professional.id },
      orderBy: { order: "asc" },
    }),
    getProfessionalRatingSummary(professional.id),
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
      </section>

      {salons.length > 0 && (
        <section>
          <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-ink/60">Nuestros salones</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {salons.map((salon) => (
              <SalonCard
                key={salon.id}
                professionalSlug={professional.slug}
                name={salon.name}
                photoUrl={salon.photoUrl}
                address={salon.address}
                rating={ratingSummary.average}
                reviewCount={ratingSummary.count}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
