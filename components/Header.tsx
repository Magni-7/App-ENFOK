import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-2 font-serif text-2xl font-semibold tracking-tight">
          <span className="h-2.5 w-2.5 rounded-full bg-clay" aria-hidden="true" />
          Trenzame
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/catalogue" className="hover:opacity-60">
            Descubrir
          </Link>
          <Link href="/galeria" className="hover:opacity-60">
            Galería
          </Link>
          <Link href="/cuenta/citas" className="hover:opacity-60">
            Mis citas
          </Link>
          <Link href="/cuenta" className="hover:opacity-60">
            Cuenta
          </Link>
          <Link href="/admin" className="hover:opacity-60">
            Pro
          </Link>
        </nav>
      </div>
    </header>
  );
}
