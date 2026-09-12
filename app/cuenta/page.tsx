import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentClient } from "@/lib/clientAuth";
import { logoutClient } from "./actions";

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
      <div>
        <h1 className="font-serif text-2xl font-semibold tracking-tight">Mi perfil</h1>
        <p className="mt-2 text-sm text-ink/70">{client.email}</p>
      </div>

      <nav className="flex flex-col divide-y divide-line border-y border-line text-sm">
        <Link href="/cuenta/citas" className="flex items-center justify-between py-4 hover:text-clay">
          Mis citas
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
