import { PrismaClient } from "@prisma/client";

// Supprime les styles placeholder créés par le seed initial (photos stock,
// prix inventés), en laissant intactes les fiches réellement ajoutées par la
// professionnelle depuis /admin/galeria. Exécuté une fois via le script de
// build, à retirer une fois déployé.
const prisma = new PrismaClient();

const PLACEHOLDER_STYLE_NAMES = [
  "Box Braids largas",
  "Knotless Braids largas",
  "Fulani Braids largas",
  "Senegalese Twists largas",
  "Ghana Braids largas",
  "Lemonade Braids largas",
  "Feed-in Braids largas",
  "Micro Braids largas",
  "Faux Locs largas",
  "Passion Twists largas",
  "Goddess Braids largas",
  "Bob Braids cortas",
  "Boho Braids cortas",
  "Cornrows cortas",
  "Havana Twists cortas",
  "Crochet Braids cortas",
  "Stitch Braids cortas",
  "Vixen Braids cortas",
];

async function main() {
  // "bookings: { none: {} }" évite de toucher à un style placeholder qui
  // aurait malgré tout déjà une vraie réservation dessus.
  const { count } = await prisma.style.deleteMany({
    where: { name: { in: PLACEHOLDER_STYLE_NAMES }, bookings: { none: {} } },
  });
  console.log(`cleanup-placeholder-styles: ${count} style(s) placeholder supprimé(s).`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
