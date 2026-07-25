import Image from "next/image";

export function Logo({ className = "h-9 w-auto" }: { className?: string }) {
  return (
    <Image
      src="/brand/logo.svg"
      alt="Health Upgrade"
      width={477}
      height={113}
      priority
      className={className}
    />
  );
}
