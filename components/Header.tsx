import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-6 sm:py-5">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 font-serif text-xl font-semibold tracking-tight sm:text-2xl"
        >
          <span className="h-2.5 w-2.5 rounded-full bg-clay" aria-hidden="true" />
          Trenzame
        </Link>
        <nav className="-mx-4 flex items-center gap-4 overflow-x-auto whitespace-nowrap px-4 text-xs sm:mx-0 sm:gap-6 sm:overflow-visible sm:px-0 sm:text-sm">
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
