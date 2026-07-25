import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-brand-navy-500 text-white hover:bg-brand-navy-700 focus-visible:outline-brand-navy-500",
  secondary:
    "bg-white text-brand-navy-500 border border-brand-navy-500/15 hover:border-brand-navy-500/40 focus-visible:outline-brand-navy-500",
  ghost:
    "bg-transparent text-brand-navy-500 hover:bg-brand-navy-500/5 focus-visible:outline-brand-navy-500",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold tracking-wide transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 whitespace-nowrap";

export function Button({
  href,
  variant = "primary",
  children,
  className = "",
  ...props
}: {
  href?: string;
  variant?: Variant;
  children: ReactNode;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const classes = `${base} ${variantClasses[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
