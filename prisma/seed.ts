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
  await prisma.salon.deleteMany({});
  await prisma.professional.deleteMany({});

  const eva = await prisma.professional.create({
    data: {
      slug: DEFAULT_PROFESSIONAL_SLUG,
      displayName: "Eva",
      bio: "Trenzas a medida en Barcelona.",
      instagramHandle: "braidingeva",
      instagramDmUsername: "braidingeva",
      whatsappNumber: "34633779158",
      email: "enfoko.bcn@gmail.com",
      // Horaires de base d'Eva : 9h-20h (les futures braideuses choisiront
      // les leurs elles-mêmes, le défaut du schéma est 24h/24 en attendant).
      workDayStartMinutes: 9 * 60,
      workDayEndMinutes: 20 * 60,
    },
  });

  await prisma.salon.create({
    data: {
      professionalId: eva.id,
      name: "ENFOK.O Barbershop",
      photoUrl: "/images/salons/enfoko-barbershop/local.jpg",
      address: "Carrer de Carreras i Candi, 11, 08028 Barcelona",
      order: 1,
    },
  });

  const longues = await prisma.category.create({
    data: {
      professionalId: eva.id,
      name: "Trenzas largas",
      slug: "longues",
      order: 1,
    },
  });

  const courtes = await prisma.category.create({
    data: {
      professionalId: eva.id,
      name: "Trenzas cortas",
      slug: "courtes",
      order: 2,
    },
  });

  const styles = [
    {
      categoryId: longues.id,
      name: "Box Braids largas",
      description: "Clásicas y atemporales, box braids finas hasta la zona baja de la espalda.",
      basePriceCents: 12000,
      durationMinutes: 300,
      minHairLength: "Mínimo hombro",
      hairProvidedBy: "CLIENT" as const,
      order: 1,
      photoSlug: "box-braids",
    },
    {
      categoryId: longues.id,
      name: "Knotless Braids largas",
      description: "Trenzas sin nudo, más ligeras y cómodas sobre cabello largo.",
      basePriceCents: 14000,
      durationMinutes: 360,
      minHairLength: "Mínimo hombro",
      hairProvidedBy: "CLIENT" as const,
      order: 2,
      photoSlug: "knotless-braids",
    },
    {
      categoryId: longues.id,
      name: "Fulani Braids largas",
      description: "Trenzas tribales con motivos y perlas, versión larga.",
      basePriceCents: 13000,
      durationMinutes: 330,
      minHairLength: "Mínimo barbilla",
      hairProvidedBy: "PROFESSIONAL" as const,
      order: 3,
      photoSlug: "fulani-braids",
    },
    {
      categoryId: longues.id,
      name: "Senegalese Twists largas",
      description: "Twists lisos y brillantes, look elegante de larga duración.",
      basePriceCents: 13500,
      durationMinutes: 300,
      minHairLength: "Mínimo hombro",
      hairProvidedBy: "CLIENT" as const,
      order: 4,
      photoSlug: "senegalese-twists",
    },
    {
      categoryId: longues.id,
      name: "Ghana Braids largas",
      description: "También llamadas banana braids: trenzas pegadas al cuero cabelludo con volumen creciente.",
      basePriceCents: 12500,
      durationMinutes: 270,
      minHairLength: "Mínimo hombro",
      hairProvidedBy: "PROFESSIONAL" as const,
      order: 5,
      photoSlug: "ghana-braids",
    },
    {
      categoryId: longues.id,
      name: "Lemonade Braids largas",
      description: "Trenzas pegadas todas hacia un lado, estilo asimétrico muy popular.",
      basePriceCents: 12000,
      durationMinutes: 270,
      minHairLength: "Mínimo hombro",
      hairProvidedBy: "CLIENT" as const,
      order: 6,
      photoSlug: "lemonade-braids",
    },
    {
      categoryId: longues.id,
      name: "Feed-in Braids largas",
      description: "Extensiones incorporadas progresivamente para un efecto de nacimiento natural.",
      basePriceCents: 11000,
      durationMinutes: 240,
      minHairLength: "Mínimo hombro",
      hairProvidedBy: "CLIENT" as const,
      order: 7,
      photoSlug: "feed-in-braids",
    },
    {
      categoryId: longues.id,
      name: "Micro Braids largas",
      description: "Trenzas muy finas y numerosas para un movimiento y una caída natural.",
      basePriceCents: 18000,
      durationMinutes: 480,
      minHairLength: "Mínimo hombro",
      hairProvidedBy: "CLIENT" as const,
      order: 8,
      photoSlug: "micro-braids",
    },
    {
      categoryId: longues.id,
      name: "Faux Locs largas",
      description: "Efecto rastas sin el compromiso definitivo, textura mate y natural.",
      basePriceCents: 15000,
      durationMinutes: 360,
      minHairLength: "Mínimo hombro",
      hairProvidedBy: "CLIENT" as const,
      order: 9,
      photoSlug: "faux-locs",
    },
    {
      categoryId: longues.id,
      name: "Passion Twists largas",
      description: "Twists suaves y esponjosos con textura rizada, ligeros de llevar.",
      basePriceCents: 14500,
      durationMinutes: 330,
      minHairLength: "Mínimo hombro",
      hairProvidedBy: "CLIENT" as const,
      order: 10,
      photoSlug: "passion-twists",
    },
    {
      categoryId: longues.id,
      name: "Goddess Braids largas",
      description: "Trenzas gruesas pegadas al cuero cabelludo, look escultural y sofisticado.",
      basePriceCents: 11500,
      durationMinutes: 240,
      minHairLength: "Mínimo hombro",
      hairProvidedBy: "PROFESSIONAL" as const,
      order: 11,
      photoSlug: "goddess-braids",
    },
    {
      categoryId: courtes.id,
      name: "Bob Braids cortas",
      description: "Corte bob trenzado, efecto natural y fácil de mantener.",
      basePriceCents: 8000,
      durationMinutes: 180,
      minHairLength: "Sin longitud mínima",
      hairProvidedBy: "CLIENT" as const,
      order: 1,
      photoSlug: "bob-braids",
    },
    {
      categoryId: courtes.id,
      name: "Boho Braids cortas",
      description: "Trenzas boho con mechones rizados a la vista, versión corta.",
      basePriceCents: 9000,
      durationMinutes: 210,
      minHairLength: "Mínimo barbilla",
      hairProvidedBy: "CLIENT" as const,
      order: 2,
      photoSlug: "boho-braids",
    },
    {
      categoryId: courtes.id,
      name: "Cornrows cortas",
      description: "Trenzas pegadas clásicas, líneas limpias, ideales para looks deportivos.",
      basePriceCents: 6000,
      durationMinutes: 120,
      minHairLength: "Sin longitud mínima",
      hairProvidedBy: "PROFESSIONAL" as const,
      order: 3,
      photoSlug: "cornrows",
    },
    {
      categoryId: courtes.id,
      name: "Havana Twists cortas",
      description: "Twists voluminosos de textura afro, versión corta y ligera.",
      basePriceCents: 9500,
      durationMinutes: 210,
      minHairLength: "Sin longitud mínima",
      hairProvidedBy: "CLIENT" as const,
      order: 4,
      photoSlug: "havana-twists",
    },
    {
      categoryId: courtes.id,
      name: "Crochet Braids cortas",
      description: "Extensiones aplicadas con técnica de crochet, instalación rápida.",
      basePriceCents: 9000,
      durationMinutes: 150,
      minHairLength: "Sin longitud mínima",
      hairProvidedBy: "CLIENT" as const,
      order: 5,
      photoSlug: "crochet-braids",
    },
    {
      categoryId: courtes.id,
      name: "Stitch Braids cortas",
      description: "Trenzas pegadas con acabado muy limpio tipo costura, diseños geométricos.",
      basePriceCents: 7000,
      durationMinutes: 150,
      minHairLength: "Sin longitud mínima",
      hairProvidedBy: "PROFESSIONAL" as const,
      order: 6,
      photoSlug: "stitch-braids",
    },
    {
      categoryId: courtes.id,
      name: "Vixen Braids cortas",
      description: "Trenzas con secciones sueltas para poder llevar el pelo suelto o recogido.",
      basePriceCents: 10000,
      durationMinutes: 210,
      minHairLength: "Mínimo barbilla",
      hairProvidedBy: "CLIENT" as const,
      order: 7,
      photoSlug: "vixen-braids",
    },
  ];

  for (const { photoSlug, ...styleData } of styles) {
    const style = await prisma.style.create({
      data: {
        professionalId: eva.id,
        ...styleData,
      },
    });

    await prisma.stylePhoto.create({
      data: {
        styleId: style.id,
        url: `/images/styles/${photoSlug}.jpg`,
        alt: style.name,
        order: 1,
      },
    });
  }

  // Les créneaux ne sont plus pré-générés : ils sont calculés à la volée
  // (voir lib/availability.ts) à partir de la fenêtre de travail du
  // professionnel (workDayStartMinutes/workDayEndMinutes, 9h-20h par défaut)
  // et des rendez-vous déjà confirmés. Rien à seeder ici.

  console.log(`Seed terminé : professionnel "${eva.displayName}", ${styles.length} styles.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
