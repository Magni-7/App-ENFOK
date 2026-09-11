import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-5">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight">
          <span className="h-2 w-2 rounded-full bg-clay" aria-hidden="true" />
          BraidHub
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/catalogue" className="hover:opacity-60">
            Catálogo
          </Link>
          <Link href="/admin" className="hover:opacity-60">
            Zona profesional
          </Link>
        </nav>
      </div>
    </header>
  );
}
