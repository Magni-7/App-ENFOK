import type { Metadata } from "next";
import Link from "next/link";
import { requireProfessional } from "@/lib/professional";
import { updateAccountDetails, updateAccountPassword } from "../actions";

export const metadata: Metadata = {
  title: "Detalles de la cuenta — Trenzame",
};

type DetallesPageProps = {
  searchParams: Promise<{ error?: string; actualizado?: string }>;
};

const ERROR_MESSAGES: Record<string, string> = {
  name_required: "Por favor indica un nombre.",
  invalid_email: "Por favor indica un email válido.",
  email_used: "Ya existe una cuenta con ese email.",
  current_password_invalid: "La contraseña actual no es correcta.",
  password_short: "La nueva contraseña debe tener al menos 8 caracteres.",
  password_mismatch: "Las contraseñas nuevas no coinciden.",
};

export default async function AdminDetallesPage({ searchParams }: DetallesPageProps) {
  const professional = await requireProfessional();
  const { error, actualizado } = await searchParams;

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-8">
      <div>
        <Link href="/admin" className="text-sm text-ink/60 hover:text-ink">
          ← Volver a la agenda
        </Link>
        <h1 className="mt-2 font-serif text-2xl font-semibold tracking-tight">Detalles de la cuenta</h1>
      </div>

      {actualizado && (
        <p className="border border-line bg-cream p-4 text-sm text-ink/80">Datos actualizados correctamente.</p>
      )}
      {error && (
        <p className="border border-clay/40 bg-clay/10 p-4 text-sm text-clay">
          {ERROR_MESSAGES[error] ?? "Ha ocurrido un error, inténtalo de nuevo."}
        </p>
      )}

      <form action={updateAccountDetails} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          Nombre del salón / profesional
          <input
            type="text"
            name="displayName"
            required
            defaultValue={professional.displayName}
            className="border border-line px-3 py-2 focus:border-ink focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Email
          <input
            type="email"
            name="email"
            required
            defaultValue={professional.email ?? ""}
            className="border border-line px-3 py-2 focus:border-ink focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Teléfono (WhatsApp)
          <input
            type="tel"
            name="whatsappNumber"
            defaultValue={professional.whatsappNumber ?? ""}
            placeholder="34600000000"
            className="border border-line px-3 py-2 focus:border-ink focus:outline-none"
          />
        </label>
        <button
          type="submit"
          className="self-start border border-ink bg-ink px-6 py-2 text-sm font-medium uppercase tracking-wide text-white transition hover:bg-paper hover:text-ink"
        >
          Guardar cambios
        </button>
      </form>

      <div className="border-t border-line pt-6">
        <h2 className="mb-1 text-sm uppercase tracking-widest text-ink/60">Código QR</h2>
        <p className="mb-4 text-sm text-ink/60">
          Descarga un código QR que apunta directamente a tu página pública, para imprimirlo o
          compartirlo (salón, tarjetas, redes sociales).
        </p>
        <a
          href="/admin/qr"
          className="inline-block self-start border border-ink px-6 py-2 text-sm font-medium uppercase tracking-wide transition hover:bg-ink hover:text-white"
        >
          Descargar código QR
        </a>
      </div>

      <div className="border-t border-line pt-6">
        <h2 className="mb-4 text-sm uppercase tracking-widest text-ink/60">Cambiar contraseña</h2>
        <form action={updateAccountPassword} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm">
            Contraseña actual
            <input
              type="password"
              name="currentPassword"
              required
              className="border border-line px-3 py-2 focus:border-ink focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Nueva contraseña
            <input
              type="password"
              name="newPassword"
              required
              minLength={8}
              className="border border-line px-3 py-2 focus:border-ink focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Confirmar nueva contraseña
            <input
              type="password"
              name="newPasswordConfirm"
              required
              minLength={8}
              className="border border-line px-3 py-2 focus:border-ink focus:outline-none"
            />
          </label>
          <button
            type="submit"
            className="self-start border border-ink px-6 py-2 text-sm font-medium uppercase tracking-wide transition hover:bg-ink hover:text-white"
          >
            Cambiar contraseña
          </button>
        </form>
      </div>
    </div>
  );
}
