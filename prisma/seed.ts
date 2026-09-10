import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Doit rester identique à DEFAULT_PROFESSIONAL_SLUG dans lib/professional.ts
const DEFAULT_PROFESSIONAL_SLUG = "eva";

// ⚠️ Toutes les données ci-dessous sont des PLACEHOLDERS créés en attendant
// les réponses d'Eva au questionnaire. À remplacer par les vraies infos
// (styles, prix, durées, longueurs minimales, coordonnées) dès réception.

async function main() {
  await prisma.booking.deleteMany({});
  await prisma.slot.deleteMany({});
  await prisma.stylePhoto.deleteMany({});
  await prisma.style.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.professional.deleteMany({});

  const eva = await prisma.professional.create({
    data: {
      slug: DEFAULT_PROFESSIONAL_SLUG,
      displayName: "Eva",
      bio: "Tresses & braids sur-mesure à Barcelone.",
      instagramHandle: "braidingeva",
      instagramDmUsername: "braidingeva",
      // Placeholder : à remplacer par le vrai numéro WhatsApp d'Eva (format international, ex. 34600000000)
      whatsappNumber: "34600000000",
    },
  });

  const longues = await prisma.category.create({
    data: {
      professionalId: eva.id,
      name: "Tresses longues",
      slug: "longues",
      order: 1,
    },
  });

  const courtes = await prisma.category.create({
    data: {
      professionalId: eva.id,
      name: "Tresses courtes",
      slug: "courtes",
      order: 2,
    },
  });

  const styles = [
    {
      categoryId: longues.id,
      name: "Box Braids longues",
      description: "Classiques et intemporelles, box braids fines jusqu'au bas du dos.",
      basePriceCents: 12000,
      durationMinutes: 300,
      minHairLength: "Épaule minimum",
      hairProvidedBy: "CLIENT" as const,
      order: 1,
    },
    {
      categoryId: longues.id,
      name: "Knotless Braids longues",
      description: "Tresses sans nœud, plus légères et confortables sur cheveu long.",
      basePriceCents: 14000,
      durationMinutes: 360,
      minHairLength: "Épaule minimum",
      hairProvidedBy: "CLIENT" as const,
      order: 2,
    },
    {
      categoryId: longues.id,
      name: "Fulani Braids longues",
      description: "Tresses tribales avec motifs et perles, version longue.",
      basePriceCents: 13000,
      durationMinutes: 330,
      minHairLength: "Menton minimum",
      hairProvidedBy: "PROFESSIONAL" as const,
      order: 3,
    },
    {
      categoryId: courtes.id,
      name: "Bob Braids courtes",
      description: "Carré tressé court, effet naturel et facile à entretenir.",
      basePriceCents: 8000,
      durationMinutes: 180,
      minHairLength: "Aucune longueur minimale",
      hairProvidedBy: "CLIENT" as const,
      order: 1,
    },
    {
      categoryId: courtes.id,
      name: "Boho Braids courtes",
      description: "Tresses bohèmes avec mèches bouclées apparentes, version courte.",
      basePriceCents: 9000,
      durationMinutes: 210,
      minHairLength: "Menton minimum",
      hairProvidedBy: "CLIENT" as const,
      order: 2,
    },
  ];

  for (const styleData of styles) {
    const style = await prisma.style.create({
      data: {
        professionalId: eva.id,
        ...styleData,
      },
    });

    await prisma.stylePhoto.create({
      data: {
        styleId: style.id,
        url: "/images/placeholder-style.svg",
        alt: `Photo à venir — ${style.name}`,
        order: 1,
      },
    });
  }

  // Quelques créneaux disponibles sur les prochains jours, pour pouvoir
  // tester le flux de réservation de bout en bout.
  const now = new Date();
  const slotsToCreate: { startAt: Date; endAt: Date }[] = [];

  for (let dayOffset = 1; dayOffset <= 10; dayOffset++) {
    const day = new Date(now);
    day.setDate(day.getDate() + dayOffset);
    // On saute le dimanche (jour de repos par défaut, à ajuster avec Eva)
    if (day.getDay() === 0) continue;

    for (const hour of [9, 13, 16]) {
      const startAt = new Date(day);
      startAt.setHours(hour, 0, 0, 0);
      const endAt = new Date(startAt);
      endAt.setHours(startAt.getHours() + 4);
      slotsToCreate.push({ startAt, endAt });
    }
  }

  await prisma.slot.createMany({
    data: slotsToCreate.map((s) => ({
      professionalId: eva.id,
      startAt: s.startAt,
      endAt: s.endAt,
    })),
  });

  console.log(`Seed terminé : professionnel "${eva.displayName}", ${styles.length} styles, ${slotsToCreate.length} créneaux.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
