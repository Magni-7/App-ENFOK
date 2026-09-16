import { cookies } from "next/headers";
import Link from "next/link";
import { COOKIE_NAME, getProfessionalIdFromSession } from "@/lib/adminSession";

export default async function Header() {
  const cookieStore = await cookies();
  const isProfessional = Boolean(getProfessionalIdFromSession(cookieStore.get(COOKIE_NAME)?.value));

  return (
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-6 sm:py-5">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 font-serif text-xl font-semibold tracking-tight sm:text-2xl"
        >
          <svg viewBox="0 0 64 64" className="h-6 w-6 shrink-0" aria-hidden="true">
            <defs>
              <linearGradient id="trenzameZGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#8a3324" />
                <stop offset="1" stopColor="#4b6b52" />
              </linearGradient>
            </defs>
            <path
              d="M18,16 L46,16 L18,48 L46,48"
              fill="none"
              stroke="url(#trenzameZGrad)"
              strokeWidth="9"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>
            Tren<span className="text-clay">z</span>ame
          </span>
        </Link>
        <nav className="-mx-4 flex items-center gap-4 overflow-x-auto whitespace-nowrap px-4 text-xs sm:mx-0 sm:gap-6 sm:overflow-visible sm:px-0 sm:text-sm">
          <Link href="/catalogue" className="hover:opacity-60">
            Descubrir
          </Link>
          <Link href="/galeria" className="hover:opacity-60">
            Galería
          </Link>
          <Link href="/cuenta" className="hover:opacity-60">
            Cuenta
          </Link>
          {isProfessional && (
            <Link href="/admin" className="hover:opacity-60">
              Mi panel
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
