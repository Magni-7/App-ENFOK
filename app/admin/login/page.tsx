import { login } from "../actions";

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const { error } = await searchParams;
  return (
    <div className="mx-auto flex max-w-sm flex-col gap-6 py-16">
      <h1 className="text-xl font-semibold tracking-tight">Zona profesional — Eva</h1>

      <form action={login} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          Contraseña
          <input
            type="password"
            name="password"
            required
            autoFocus
            className="border border-line px-3 py-2 focus:border-ink focus:outline-none"
          />
        </label>

        {error && (
          <p className="text-sm text-red-600">Contraseña incorrecta.</p>
        )}

        <button
          type="submit"
          className="border border-ink bg-ink px-6 py-3 text-sm font-medium uppercase tracking-wide text-white transition hover:bg-paper hover:text-ink"
        >
          Iniciar sesión
        </button>
      </form>
    </div>
  );
}
