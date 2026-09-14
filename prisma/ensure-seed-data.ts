import { PrismaClient } from "@prisma/client";

// Script idempotent (upsert) exécuté une fois au build pour ajouter le salon
// ENFOK.O Barbershop sans toucher aux données déjà en production (contrairement
// à seed.ts qui efface tout). À retirer du script "build" une fois déployé.
const prisma = new PrismaClient();

const DEFAULT_PROFESSIONAL_SLUG = "eva";

async function main() {
  const professional = await prisma.professional.findUnique({
    where: { slug: DEFAULT_PROFESSIONAL_SLUG },
  });
  if (!professional) return;

  // Personne n'a encore laissé d'avis : remet la note à 0 plutôt que le
  // placeholder précédent (5), qui donnait une fausse impression.
  if (professional.rating !== 0) {
    await prisma.professional.update({ where: { id: professional.id }, data: { rating: 0 } });
  }

  await prisma.salon.upsert({
    where: {
      professionalId_name: { professionalId: professional.id, name: "ENFOK.O Barbershop" },
    },
    update: { address: "Carrer de Carreras i Candi, 11, 08028 Barcelona" },
    create: {
      professionalId: professional.id,
      name: "ENFOK.O Barbershop",
      photoUrl: "/images/salons/enfoko-barbershop/local.jpg",
      address: "Carrer de Carreras i Candi, 11, 08028 Barcelona",
      order: 1,
    },
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
