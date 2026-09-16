"use client";

import { useState } from "react";

type DepositFieldsetProps = {
  defaultEnabled?: boolean;
  defaultType?: "FIXED" | "PERCENTAGE" | null;
  defaultEuros?: string;
  defaultPercent?: string;
};

export default function DepositFieldset({
  defaultEnabled = false,
  defaultType,
  defaultEuros,
  defaultPercent,
}: DepositFieldsetProps) {
  const [enabled, setEnabled] = useState(defaultEnabled);
  const [type, setType] = useState<"FIXED" | "PERCENTAGE">(defaultType ?? "FIXED");

  return (
    <div className="flex flex-col gap-3 border border-line p-4">
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="depositEnabled"
          defaultChecked={defaultEnabled}
          onChange={(e) => setEnabled(e.target.checked)}
          className="h-4 w-4 border-line"
        />
        Pedir un adelanto al reservar
      </label>
      <p className="text-xs text-ink/60">
        Opcional — puedes activarlo, desactivarlo o cambiar el importe cuando quieras desde "Detalles
        de la cuenta".
      </p>

      {enabled && (
        <div className="flex flex-wrap items-end gap-4">
          <label className="flex flex-col gap-1 text-sm">
            Tipo de adelanto
            <select
              name="depositType"
              value={type}
              onChange={(e) => setType(e.target.value as "FIXED" | "PERCENTAGE")}
              className="border border-line bg-paper px-3 py-2 focus:border-ink focus:outline-none"
            >
              <option value="FIXED">Cantidad fija</option>
              <option value="PERCENTAGE">Porcentaje del precio</option>
            </select>
          </label>

          {type === "FIXED" ? (
            <label className="flex flex-col gap-1 text-sm">
              Importe (€)
              <input
                type="number"
                name="depositValueEuros"
                min="0.01"
                step="0.01"
                defaultValue={defaultEuros}
                placeholder="20"
                className="w-32 border border-line px-3 py-2 focus:border-ink focus:outline-none"
              />
            </label>
          ) : (
            <label className="flex flex-col gap-1 text-sm">
              Porcentaje (%)
              <input
                type="number"
                name="depositValuePercent"
                min="1"
                max="100"
                defaultValue={defaultPercent}
                placeholder="20"
                className="w-32 border border-line px-3 py-2 focus:border-ink focus:outline-none"
              />
            </label>
          )}
        </div>
      )}
    </div>
  );
}
