import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-5">
        <Link href="/" className="flex items-center gap-2.5">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 4 H20 V8 H17 V19 H15 V8 H13 V19 H11 V8 H9 V19 H7 V8 H4 Z" fill="currentColor" className="text-ink" />
          </svg>
          <span className="flex flex-col">
            <span className="font-serif text-2xl font-semibold leading-none tracking-tight">Trenzame</span>
            <svg width="100" height="6" viewBox="0 0 100 6" fill="none" className="mt-1.5" aria-hidden="true">
              <path
                d="M0 3.5 Q 3.5 0.8 7 3.5 T 14 3.5 T 21 3.5 T 28 3.5 T 35 3.5 T 42 3.5 T 49 3.5 T 56 3.5 T 63 3.5 T 70 3.5 T 77 3.5 T 84 3.5 T 91 3.5 T 100 3.5"
                stroke="#8a3324"
                strokeWidth="1.4"
                fill="none"
              />
              <path
                d="M0 3.5 Q 3.5 6.2 7 3.5 T 14 3.5 T 21 3.5 T 28 3.5 T 35 3.5 T 42 3.5 T 49 3.5 T 56 3.5 T 63 3.5 T 70 3.5 T 77 3.5 T 84 3.5 T 91 3.5 T 100 3.5"
                stroke="currentColor"
                strokeWidth="1.4"
                fill="none"
                className="text-ink"
                opacity="0.55"
              />
            </svg>
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/catalogue" className="hover:opacity-60">
            Catálogo
          </Link>
          <Link href="/galeria" className="hover:opacity-60">
            Galería
          </Link>
          <Link href="/admin" className="hover:opacity-60">
            Zona profesional
          </Link>
        </nav>
      </div>
    </header>
  );
}
