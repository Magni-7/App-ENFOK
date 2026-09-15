import Link from "next/link";
import { login } from "../actions";

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const { error } = await searchParams;
  return (
    <div className="mx-auto flex max-w-sm flex-col gap-6 py-16">
      <h1 className="text-xl font-semibold tracking-tight">Zona profesional</h1>

      <form action={login} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          Email
          <input
            type="email"
            name="email"
            required
            autoFocus
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

        {error && (
          <p className="text-sm text-red-600">Email o contraseña incorrectos.</p>
        )}

        <button
          type="submit"
          className="border border-ink bg-ink px-6 py-3 text-sm font-medium uppercase tracking-wide text-white transition hover:bg-paper hover:text-ink"
        >
          Iniciar sesión
        </button>
      </form>

      <p className="text-center text-sm text-ink/70">
        <Link href="/admin/recuperar" className="underline underline-offset-4 hover:text-ink">
          ¿Olvidaste tu contraseña?
        </Link>
      </p>

      <p className="text-center text-sm text-ink/70">
        ¿Eres profesional y no tienes cuenta?{" "}
        <Link href="/admin/registro" className="underline underline-offset-4 hover:text-ink">
          Crea tu cuenta
        </Link>
      </p>
    </div>
  );
}
