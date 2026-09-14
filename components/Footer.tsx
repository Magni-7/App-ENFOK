import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-3xl px-4 py-8 text-xs text-ink/60">
        <p>Trenzame · reserva tu cita de trenzas en Barcelona</p>
        <nav className="mt-4 flex flex-wrap gap-x-4 gap-y-1">
          <Link href="/aviso-legal" className="hover:text-ink">
            Aviso legal
          </Link>
          <Link href="/privacidad" className="hover:text-ink">
            Política de privacidad
          </Link>
          <Link href="/cookies" className="hover:text-ink">
            Política de cookies
          </Link>
          <Link href="/admin" className="hover:text-ink">
            Zona profesional
          </Link>
        </nav>
      </div>
    </footer>
  );
}
