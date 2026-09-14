import type { Metadata } from "next";
import { requestLoginLink } from "./actions";

export const metadata: Metadata = {
  title: "Acceder a mi cuenta — Trenzame",
};

type LoginPageProps = {
  searchParams: Promise<{ enviado?: string; expirado?: string }>;
};

export default async function ClientLoginPage({ searchParams }: LoginPageProps) {
  const { enviado, expirado } = await searchParams;

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold tracking-tight">Mi cuenta</h1>
        <p className="mt-2 text-sm text-ink/70">
          Indica tu email y te enviamos un enlace para acceder, sin contraseña.
        </p>
      </div>

      {expirado && (
        <p className="border border-clay/40 bg-clay/10 p-4 text-sm text-clay">
          Ese enlace ha caducado o ya se ha usado. Pide uno nuevo abajo.
        </p>
      )}

      {enviado ? (
        <p className="border border-line bg-cream p-4 text-sm text-ink/80">
          Te hemos enviado un enlace de acceso por email. Ábrelo desde este dispositivo para entrar en
          tu cuenta.
        </p>
      ) : (
        <form action={requestLoginLink} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm">
            Email
            <input
              type="email"
              name="email"
              required
              placeholder="tucorreo@ejemplo.com"
              className="border border-line px-3 py-2 focus:border-ink focus:outline-none"
            />
          </label>
          <button
            type="submit"
            className="border border-ink bg-ink px-6 py-3 text-sm font-medium uppercase tracking-wide text-white transition hover:bg-paper hover:text-ink"
          >
            Enviar enlace de acceso
          </button>
        </form>
      )}
    </div>
  );
}
