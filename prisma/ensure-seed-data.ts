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

  await prisma.salon.upsert({
    where: {
      professionalId_name: { professionalId: professional.id, name: "ENFOK.O Barbershop" },
    },
    update: {},
    create: {
      professionalId: professional.id,
      name: "ENFOK.O Barbershop",
      photoUrl: "/images/salons/enfoko-barbershop/local.jpg",
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
