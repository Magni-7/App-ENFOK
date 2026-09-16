// Convention de nommage pour regrouper des styles en variantes d'une même
// famille (ex. "Box Braids - Hombro" / "Box Braids - Cintura") : chaque
// variante reste une fiche Style indépendante avec son propre prix/durée,
// sans migration de schéma. Un nom sans séparateur est sa propre famille,
// sans variante.
const SEPARATOR = " - ";

export function splitStyleName(name: string): { family: string; variant: string | null } {
  const index = name.indexOf(SEPARATOR);
  if (index === -1) return { family: name, variant: null };
  return { family: name.slice(0, index).trim(), variant: name.slice(index + SEPARATOR.length).trim() };
}
