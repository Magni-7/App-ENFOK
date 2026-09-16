// Progression de longueurs reconnues pour le quiz de style (voir
// components/StyleQuiz.tsx). Style.minHairLength reste un champ texte libre
// (chaque professionnel l'écrit à sa façon) : un texte non reconnu ici est
// traité comme "sans exigence connue" et n'exclut jamais un style du quiz,
// plutôt que de risquer un faux négatif sur une formulation différente.
export const HAIR_LENGTH_LEVELS = [
  { rank: 0, minHairLength: "Sin longitud mínima", quizLabel: "Muy corto o rapado" },
  { rank: 1, minHairLength: "Mínimo barbilla", quizLabel: "Hasta la barbilla" },
  { rank: 2, minHairLength: "Mínimo hombro", quizLabel: "Hasta los hombros" },
  { rank: 3, minHairLength: "Mínimo media espalda", quizLabel: "Media espalda o más" },
] as const;

export function hairLengthRank(minHairLength: string): number | null {
  const match = HAIR_LENGTH_LEVELS.find(
    (level) => level.minHairLength.toLowerCase() === minHairLength.trim().toLowerCase()
  );
  return match ? match.rank : null;
}
