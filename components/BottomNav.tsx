"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ICONS = {
  home: (
    <path
      d="M4 11.5 12 5l8 6.5M6 10v9a1 1 0 0 0 1 1h3v-5h4v5h3a1 1 0 0 0 1-1v-9"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  grid: (
    <path
      d="M4 5h6v6H4zM14 5h6v6h-6zM4 15h6v6H4zM14 15h6v6h-6z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  user: (
    <path
      d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM5 21a7 7 0 0 1 14 0"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="16" rx="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
};

export default function BottomNav() {
  const pathname = usePathname();

  const items = [
    { href: "/", label: "Inicio", icon: ICONS.home, active: pathname === "/" },
    {
      href: "/catalogue",
      label: "Descubrir",
      icon: ICONS.grid,
      active: pathname.startsWith("/catalogue") || pathname.startsWith("/styles"),
    },
    { href: "/cuenta/citas", label: "Citas", icon: ICONS.calendar, active: pathname.startsWith("/cuenta/citas") },
    {
      href: "/cuenta",
      label: "Cuenta",
      icon: ICONS.user,
      active: pathname === "/cuenta" || pathname.startsWith("/cuenta/login"),
    },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-paper/95 backdrop-blur sm:hidden">
      <div className="mx-auto flex max-w-3xl items-center justify-around px-2 pb-[env(safe-area-inset-bottom)]">
        {items.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] transition ${
              item.active ? "text-clay" : "text-ink/50"
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              className="h-5 w-5"
            >
              {item.icon}
            </svg>
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
