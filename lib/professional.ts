import { prisma } from "@/lib/prisma";

// V1 ne sert qu'un seul professionnel (Eva), identifié par ce slug.
// Le reste de l'app ne doit jamais supposer "il n'y a qu'un professionnel" :
// on passe toujours par cette fonction plutôt que de coder son id en dur,
// pour qu'ajouter un deuxième professionnel plus tard reste trivial.
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
