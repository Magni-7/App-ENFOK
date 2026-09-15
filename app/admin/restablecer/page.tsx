import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { resetProfessionalPassword } from "./actions";

export const metadata: Metadata = {
  title: "Restablecer contraseña — Trenzame",
};

type RestablecerPageProps = {
  searchParams: Promise<{ token?: string; error?: string }>;
};

const ERROR_MESSAGES: Record<string, string> = {
  password_short: "La contraseña debe tener al menos 8 caracteres.",
  password_mismatch: "Las contraseñas no coinciden.",
};

export default async function AdminRestablecerPage({ searchParams }: RestablecerPageProps) {
  const { token, error } = await searchParams;

  const resetToken = token
    ? await prisma.professionalPasswordResetToken.findUnique({ where: { token } })
    : null;
  const isValid = resetToken && !resetToken.usedAt && resetToken.expiresAt > new Date();

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-6 py-16">
      <h1 className="text-xl font-semibold tracking-tight">Restablecer contraseña</h1>

      {!isValid ? (
        <p className="border border-clay/40 bg-clay/10 p-4 text-sm text-clay">
          Este enlace ha caducado o ya se ha usado. Pide uno nuevo desde "Recuperar contraseña".
        </p>
      ) : (
        <>
          {error && (
            <p className="border border-clay/40 bg-clay/10 p-4 text-sm text-clay">
              {ERROR_MESSAGES[error] ?? "Ha ocurrido un error, inténtalo de nuevo."}
            </p>
          )}
          <form action={resetProfessionalPassword} className="flex flex-col gap-4">
            <input type="hidden" name="token" value={token} />
            <label className="flex flex-col gap-1 text-sm">
              Nueva contraseña
              <input
                type="password"
                name="password"
                required
                minLength={8}
                className="border border-line px-3 py-2 focus:border-ink focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              Confirmar nueva contraseña
              <input
                type="password"
                name="passwordConfirm"
                required
                minLength={8}
                className="border border-line px-3 py-2 focus:border-ink focus:outline-none"
              />
            </label>
            <button
              type="submit"
              className="border border-ink bg-ink px-6 py-3 text-sm font-medium uppercase tracking-wide text-white transition hover:bg-paper hover:text-ink"
            >
              Guardar nueva contraseña
            </button>
          </form>
        </>
      )}
    </div>
  );
}
