import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getDefaultProfessional } from "@/lib/professional";
import ContactButton from "@/components/ContactButton";

export default async function HomePage() {
  const professional = await getDefaultProfessional();
  const categories = await prisma.category.findMany({
    where: { professionalId: professional.id },
    orderBy: { order: "asc" },
  });

  return (
    <div className="flex flex-col gap-12">
      <section className="text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Réservez votre style de tresses</h1>
        <p className="mx-auto mt-3 max-w-md text-ink/70">
          {professional.displayName} vous accompagne pour un style de tresse précis, pensé pour votre
          longueur de cheveux et votre style de vie.
        </p>
      </section>

      <section>
        <h2 className="mb-4 text-center text-sm uppercase tracking-widest text-ink/60">
          Commencez par choisir une catégorie
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/catalogue?categorie=${category.slug}`}
              className="flex items-center justify-center border border-ink py-12 text-lg font-medium transition hover:bg-ink hover:text-white"
            >
              {category.name}
            </Link>
          ))}
        </div>
        <div className="mt-4 text-center">
          <Link href="/catalogue" className="text-sm underline underline-offset-4 hover:no-underline">
            Voir tous les styles
          </Link>
        </div>
      </section>

      <section className="flex flex-col items-center gap-3 border-t border-line pt-10 text-center">
        <p className="max-w-sm text-sm text-ink/70">
          Vous avez une idée précise de style hors catalogue ?
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
