import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getDefaultProfessional } from "@/lib/professional";
import ContactButton from "@/components/ContactButton";
import SalonCard from "@/components/SalonCard";
import FeaturedStyleCard from "@/components/FeaturedStyleCard";

// Les données (catégories, styles) changent en base y no deben quedar
// fijadas al build: renderizado bajo demanda en lugar de estático.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const professional = await getDefaultProfessional();

  const salons = await prisma.salon.findMany({
    where: { professionalId: professional.id },
    orderBy: { order: "asc" },
  });

  const featuredStyles = await prisma.style.findMany({
    where: { professionalId: professional.id, isActive: true },
    orderBy: [{ categoryId: "asc" }, { order: "asc" }],
    take: 8,
    include: { photos: { orderBy: { order: "asc" }, take: 1 } },
  });

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
                rating={professional.rating}
              />
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-mono text-xs uppercase tracking-widest text-ink/60">Estilos destacados</h2>
          <Link href="/catalogue" className="text-sm underline underline-offset-4 hover:no-underline">
            Ver todo
          </Link>
        </div>
        <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
          {featuredStyles.map((style) => (
            <FeaturedStyleCard
              key={style.id}
              id={style.id}
              name={style.name}
              photoUrl={style.photos[0]?.url ?? "/images/placeholder-style.svg"}
              basePriceCents={style.basePriceCents}
              durationMinutes={style.durationMinutes}
            />
          ))}
        </div>
      </section>

      <section className="flex flex-col items-center gap-3 border-t border-line pt-10 text-center">
        <p className="max-w-sm text-sm text-ink/70">
          ¿Tienes una idea concreta de un estilo fuera de catálogo?
        </p>
        <div className="flex justify-center">
          <ContactButton
            whatsappNumber={professional.whatsappNumber}
            instagramUsername={professional.instagramDmUsername}
          />
        </div>
      </section>
    </div>
  );
}
