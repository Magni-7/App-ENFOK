import type { Metadata } from "next";
import Link from "next/link";
import { loginClient } from "./actions";

export const metadata: Metadata = {
  title: "Acceder a mi cuenta — Trenzame",
};

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function ClientLoginPage({ searchParams }: LoginPageProps) {
  const { error } = await searchParams;

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold tracking-tight">Mi cuenta</h1>
        <p className="mt-2 text-sm text-ink/70">Inicia sesión con tu email y contraseña.</p>
      </div>

      {error && (
        <p className="border border-clay/40 bg-clay/10 p-4 text-sm text-clay">
          Email o contraseña incorrectos.
        </p>
      )}

      <form action={loginClient} className="flex flex-col gap-4">
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
        <label className="flex flex-col gap-1 text-sm">
          Contraseña
          <input
            type="password"
            name="password"
            required
            className="border border-line px-3 py-2 focus:border-ink focus:outline-none"
          />
        </label>
        <button
          type="submit"
          className="border border-ink bg-ink px-6 py-3 text-sm font-medium uppercase tracking-wide text-white transition hover:bg-paper hover:text-ink"
        >
          Iniciar sesión
        </button>
      </form>

      <p className="text-center text-sm text-ink/70">
        <Link href="/cuenta/recuperar" className="underline underline-offset-4 hover:text-ink">
          ¿Olvidaste tu contraseña?
        </Link>
      </p>

      <p className="text-center text-sm text-ink/70">
        ¿No tienes cuenta todavía?{" "}
        <Link href="/cuenta/registro" className="underline underline-offset-4 hover:text-ink">
          Regístrate
        </Link>
      </p>
    </div>
  );
}
