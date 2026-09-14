import type { Metadata } from "next";
import Link from "next/link";
import { registerClient } from "./actions";

export const metadata: Metadata = {
  title: "Crear cuenta — Trenzame",
};

type RegistroPageProps = {
  searchParams: Promise<{ error?: string }>;
};

const ERROR_MESSAGES: Record<string, string> = {
  email_used: "Ya existe una cuenta con ese email. Inicia sesión en su lugar.",
  password_mismatch: "Las contraseñas no coinciden.",
  password_short: "La contraseña debe tener al menos 8 caracteres.",
  invalid_email: "Por favor indica un email válido.",
};

export default async function RegistroPage({ searchParams }: RegistroPageProps) {
  const { error } = await searchParams;

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold tracking-tight">Crear cuenta</h1>
        <p className="mt-2 text-sm text-ink/70">
          Crea tu cuenta para ver tus próximas citas y tu historial de reservas.
        </p>
      </div>

      {error && (
        <p className="border border-clay/40 bg-clay/10 p-4 text-sm text-clay">
          {ERROR_MESSAGES[error] ?? "Ha ocurrido un error, inténtalo de nuevo."}
        </p>
      )}

      <form action={registerClient} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          Nombre (opcional)
          <input
            type="text"
            name="name"
            className="border border-line px-3 py-2 focus:border-ink focus:outline-none"
          />
        </label>
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
            minLength={8}
            className="border border-line px-3 py-2 focus:border-ink focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Confirmar contraseña
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
          Crear cuenta
        </button>
      </form>

      <p className="text-center text-sm text-ink/70">
        ¿Ya tienes cuenta?{" "}
        <Link href="/cuenta/login" className="underline underline-offset-4 hover:text-ink">
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}
