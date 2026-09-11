type SearchBarProps = {
  defaultValue?: string;
};

export default function SearchBar({ defaultValue }: SearchBarProps) {
  return (
    <form action="/catalogue" method="GET" className="relative">
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink/40"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
      </svg>
      <input
        type="search"
        name="q"
        defaultValue={defaultValue}
        placeholder="Buscar un estilo de trenzas…"
        className="w-full rounded-full border border-line bg-mist py-3 pl-11 pr-4 text-sm text-ink placeholder:text-ink/40 focus:border-clay focus:bg-white focus:outline-none"
      />
    </form>
  );
}
