import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../lib/password";

// Script idempotent (upsert) exécuté à chaque build pour garder certaines
// données de production synchronisées sans jamais les effacer (contrairement
// à seed.ts, destructif, réservé au développement local).
const prisma = new PrismaClient();

const DEFAULT_PROFESSIONAL_SLUG = "eva";

async function main() {
  const professional = await prisma.professional.findUnique({
    where: { slug: DEFAULT_PROFESSIONAL_SLUG },
  });
  if (!professional) return;

  // Le profil "Eva" est en réalité la marque ENFOK : corrige le nom affiché,
  // le vrai numéro de téléphone (WhatsApp), l'email et l'Instagram.
  await prisma.professional.update({
    where: { id: professional.id },
    data: {
      displayName: "ENFOK",
      instagramHandle: "enfok.o",
      instagramDmUsername: "enfok.o",
      whatsappNumber: "34633779158",
      email: "enfoko.bcn@gmail.com",
    },
  });

  // Migration en douceur du mot de passe admin partagé (ADMIN_PASSWORD) vers
  // un vrai compte : tant qu'aucun mot de passe propre n'a été choisi, on
  // reprend celui-là pour que la connexion existante continue de marcher.
  if (!professional.passwordHash && process.env.ADMIN_PASSWORD) {
    const passwordHash = await hashPassword(process.env.ADMIN_PASSWORD);
    await prisma.professional.update({ where: { id: professional.id }, data: { passwordHash } });
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
