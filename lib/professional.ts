import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { COOKIE_NAME, getProfessionalIdFromSession } from "@/lib/adminSession";

// La vitrine publique (accueil, catálogo, galería) reste pour l'instant
// celle d'un seul professionnel (Eva/ENFOK), identifié par ce slug. La zone
// /admin, elle, sert désormais n'importe quel professionnel inscrit : voir
// requireProfessional() ci-dessous.
export const DEFAULT_PROFESSIONAL_SLUG = "eva";

export async function getDefaultProfessional() {
  const professional = await prisma.professional.findUnique({
    where: { slug: DEFAULT_PROFESSIONAL_SLUG },
  });

  if (!professional) {
    throw new Error(
      `Professionnel "${DEFAULT_PROFESSIONAL_SLUG}" introuvable. As-tu lancé "npm run db:seed" ?`
    );
  }

  return professional;
}

// À utiliser dans toutes les pages/actions de /admin : lit le professionnel
// réellement connecté à partir du cookie de session (au lieu de toujours
// renvoyer Eva), et redirige vers /admin/login si la session est absente,
// invalide ou périmée (ex. compte supprimé).
export async function requireProfessional() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(COOKIE_NAME)?.value;
  const professionalId = getProfessionalIdFromSession(sessionCookie);
  if (!professionalId) {
    redirect("/admin/login");
  }

  const professional = await prisma.professional.findUnique({ where: { id: professionalId } });
  if (!professional) {
    redirect("/admin/login");
  }

  return professional;
}
