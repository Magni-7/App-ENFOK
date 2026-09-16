export type DepositFields = {
  depositEnabled: boolean;
  depositType: "FIXED" | "PERCENTAGE" | null;
  depositValueCents: number | null;
};

// Lit le bloc "acompte" (checkbox + montant fixe ou %) commun aux formulaires
// d'inscription et de détails du compte. Retourne null si les valeurs
// saisies ne sont pas valides (à traiter par l'appelant comme une erreur de
// formulaire), jamais une valeur par défaut silencieuse.
export function parseDepositFields(formData: FormData): DepositFields | null {
  const depositEnabled = formData.get("depositEnabled") === "on";
  if (!depositEnabled) {
    return { depositEnabled: false, depositType: null, depositValueCents: null };
  }

  const depositType = String(formData.get("depositType") ?? "");

  if (depositType === "FIXED") {
    const euros = Number(String(formData.get("depositValueEuros") ?? "").replace(",", "."));
    if (!Number.isFinite(euros) || euros <= 0) return null;
    return { depositEnabled: true, depositType: "FIXED", depositValueCents: Math.round(euros * 100) };
  }

  if (depositType === "PERCENTAGE") {
    const percent = Number(formData.get("depositValuePercent") ?? "");
    if (!Number.isInteger(percent) || percent < 1 || percent > 100) return null;
    return { depositEnabled: true, depositType: "PERCENTAGE", depositValueCents: percent };
  }

  return null;
}

export function formatDepositMessage(depositType: string, depositValueCents: number): string {
  if (depositType === "PERCENTAGE") {
    return `un adelanto del ${depositValueCents}%`;
  }
  const euros = (depositValueCents / 100).toFixed(2).replace(/\.00$/, "");
  return `un adelanto de ${euros}€`;
}
