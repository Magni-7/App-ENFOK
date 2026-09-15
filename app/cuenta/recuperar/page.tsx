import type { Metadata } from "next";
import Link from "next/link";
import { requestPasswordReset } from "./actions";

export const metadata: Metadata = {
  title: "Recuperar contraseña — Trenzame",
};

type RecuperarPageProps = {
  searchParams: Promise<{ enviado?: string }>;
};

export default async function RecuperarPage({ searchParams }: RecuperarPageProps) {
  const { enviado } = await searchParams;

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold tracking-tight">Recuperar contraseña</h1>
        <p className="mt-2 text-sm text-ink/70">
          Indica tu email y, si existe una cuenta, te enviamos un enlace para elegir una nueva contraseña.
        </p>
      </div>

      {enviado ? (
        <p className="border border-line bg-cream p-4 text-sm text-ink/80">
          Si existe una cuenta con ese email, te hemos enviado un enlace para restablecer tu
          contraseña. Revisa también la carpeta de spam.
        </p>
      ) : (
        <form action={requestPasswordReset} className="flex flex-col gap-4">
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
            Enviar enlace
          </button>
        </form>
      )}

      <p className="text-center text-sm text-ink/70">
        <Link href="/cuenta/login" className="underline underline-offset-4 hover:text-ink">
          Volver a iniciar sesión
        </Link>
      </p>
    </div>
  );
}
