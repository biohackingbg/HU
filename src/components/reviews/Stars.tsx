export function Stars({
  rating,
  size = 16,
  className = "",
}: {
  rating: number;
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-0.5 ${className}`}
      role="img"
      aria-label={`${rating} от 5 звезди`}
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} filled={i <= Math.round(rating)} size={size} />
      ))}
    </span>
  );
}

export function Star({
  filled,
  size = 16,
}: {
  filled: boolean;
  size?: number;
}) {
  return (
    <svg
      viewBox="0 0 20 20"
      width={size}
      height={size}
      aria-hidden="true"
      className={filled ? "text-amber-400" : "text-brand-navy-500/20"}
      fill="currentColor"
    >
      <path d="M10 1.6l2.47 5.01 5.53.8-4 3.9.94 5.5L10 14.2l-4.94 2.6.94-5.5-4-3.9 5.53-.8z" />
    </svg>
  );
}
