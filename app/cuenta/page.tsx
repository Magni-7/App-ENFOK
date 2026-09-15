import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentClient } from "@/lib/clientAuth";
import { logoutClient, updateAvatar } from "./actions";

export const metadata: Metadata = {
  title: "Mi perfil — Trenzame",
};

export default async function PerfilPage() {
  const client = await getCurrentClient();

  if (!client) {
    redirect("/cuenta/login");
  }

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-8">
      <div className="flex items-center gap-4">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border border-line bg-mist">
          {client.avatarUrl ? (
            <Image src={client.avatarUrl} alt={client.name ?? client.email} fill className="object-cover" sizes="80px" />
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2} className="h-full w-full p-4 text-ink/30">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20a8 8 0 0 1 16 0" />
            </svg>
          )}
        </div>
        <div>
          <h1 className="font-serif text-xl font-semibold tracking-tight">{client.name ?? client.email}</h1>
          {client.phone && <p className="mt-1 text-sm text-ink/60">{client.phone}</p>}
        </div>
      </div>

      <form action={updateAvatar} encType="multipart/form-data" className="flex items-center gap-3 text-sm">
        <label htmlFor="avatar" className="cursor-pointer underline underline-offset-4 hover:text-ink">
          Elegir foto
        </label>
        <input id="avatar" type="file" name="avatar" accept="image/*" required className="hidden" />
        <button type="submit" className="border border-line px-3 py-1.5 text-xs uppercase tracking-wide hover:border-ink">
          Guardar foto
        </button>
      </form>

      <nav className="flex flex-col divide-y divide-line border-y border-line text-sm">
        <Link href="/cuenta/citas" className="flex items-center justify-between py-4 hover:text-clay">
          Mis citas
          <span aria-hidden="true">›</span>
        </Link>
        <Link href="/cuenta/detalles" className="flex items-center justify-between py-4 hover:text-clay">
          Detalles de la cuenta
          <span aria-hidden="true">›</span>
        </Link>
        <Link href="/cuenta/avis" className="flex items-center justify-between py-4 hover:text-clay">
          Mis reseñas
          <span aria-hidden="true">›</span>
        </Link>
      </nav>

      <form action={logoutClient}>
        <button
          type="submit"
          className="w-full border border-line px-6 py-3 text-sm font-medium uppercase tracking-wide text-ink/70 transition hover:border-ink hover:text-ink"
        >
          Cerrar sesión
        </button>
      </form>
    </div>
  );
}
