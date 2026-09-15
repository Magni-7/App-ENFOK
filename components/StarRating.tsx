type StarRatingProps = {
  rating: number;
  count?: number;
  className?: string;
};

export default function StarRating({ rating, count, className = "" }: StarRatingProps) {
  const rounded = Math.round(rating * 2) / 2;

  return (
    <div className={`flex items-center gap-1 ${className}`} aria-label={`${rating.toFixed(1)} de 5 estrellas`}>
      <div className="flex" aria-hidden="true">
        {Array.from({ length: 5 }, (_, i) => {
          const filled = i + 1 <= rounded;
          const half = !filled && i + 0.5 === rounded;
          return (
            <svg key={i} viewBox="0 0 20 20" className="h-4 w-4">
              <defs>
                <linearGradient id={`star-half-${i}`}>
                  <stop offset="50%" stopColor="currentColor" />
                  <stop offset="50%" stopColor="transparent" />
                </linearGradient>
              </defs>
              <path
                d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1.99 5.79L10 14.9l-5.2 2.61.99-5.79-4.21-4.1 5.82-.85z"
                fill={filled ? "currentColor" : half ? `url(#star-half-${i})` : "none"}
                stroke="currentColor"
                strokeWidth="1"
                className="text-clay"
              />
            </svg>
          );
        })}
      </div>
      <span className="font-mono text-xs text-ink/70">
        {rating.toFixed(1)}
        {typeof count === "number" && ` (${count})`}
      </span>
    </div>
  );
}
