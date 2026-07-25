export function CheckItem({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <li className={`flex items-start gap-3 ${className}`}>
      <svg
        viewBox="0 0 20 20"
        fill="none"
        aria-hidden="true"
        className="mt-0.5 h-5 w-5 shrink-0 text-brand-sky-600"
      >
        <circle cx="10" cy="10" r="10" className="fill-brand-sky-100" />
        <path
          d="M6 10.5l2.5 2.5L14 7.5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="text-brand-navy-500/90">{children}</span>
    </li>
  );
}
