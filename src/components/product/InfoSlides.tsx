import Image from "next/image";
import { ingredients } from "@/lib/ingredients";

const forms = ingredients.filter((i) => i.category === "Форма магнезий");

const reinforcements = [
  { name: "Витамин D3", note: "мускули и имунитет" },
  { name: "Витамин B6 (P-5-P)", note: "нервна система" },
  { name: "Цинк", note: "когниция и защита" },
  { name: "Калий", note: "електролитен баланс" },
];

export function PhotoSlide({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority
      sizes="(min-width: 1024px) 40vw, 100vw"
      className="object-contain p-6"
    />
  );
}

export function PhotoThumb({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="120px"
      className="object-contain p-1.5"
    />
  );
}

export function SixFormsSlide() {
  return (
    <div className="flex h-full w-full flex-col justify-center bg-brand-sky-50 p-8 sm:p-10">
      <span className="font-display text-xs font-semibold uppercase tracking-wider text-brand-sky-600">
        Една формула
      </span>
      <h3 className="mt-2 font-display text-2xl font-extrabold leading-tight text-brand-navy-500 sm:text-3xl">
        6 форми магнезий, които работят синергично
      </h3>
      <ul className="mt-6 space-y-3">
        {forms.map((form) => (
          <li key={form.slug} className="flex items-baseline gap-3">
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 shrink-0 translate-y-1.5 rounded-full bg-brand-sky-500"
            />
            <span className="text-sm text-brand-navy-500/80">
              <span className="font-semibold text-brand-navy-500">
                {form.name}
              </span>{" "}
              — {form.roleShort}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SixFormsThumb() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-brand-sky-50">
      <span className="font-display text-lg font-extrabold leading-none text-brand-navy-500">
        6
      </span>
      <span className="mt-0.5 text-[9px] font-medium uppercase tracking-wider text-brand-navy-500/60">
        форми
      </span>
    </div>
  );
}

export function SynergySlide() {
  return (
    <div className="flex h-full w-full flex-col justify-center bg-brand-navy-500 p-8 sm:p-10">
      <span className="font-display text-xs font-semibold uppercase tracking-wider text-brand-sky-300">
        Подсилена формула
      </span>
      <h3 className="mt-2 font-display text-2xl font-extrabold leading-tight text-white sm:text-3xl">
        Не само магнезий
      </h3>
      <p className="mt-3 text-sm text-white/70">
        Четири допълнителни нутриента за максимална синергия.
      </p>
      <ul className="mt-6 grid grid-cols-2 gap-3">
        {reinforcements.map((item) => (
          <li key={item.name} className="rounded-xl bg-white/10 p-4">
            <span className="block font-display text-sm font-extrabold text-white">
              {item.name}
            </span>
            <span className="text-xs text-white/60">{item.note}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SynergyThumb() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-brand-navy-500">
      <span className="font-display text-lg font-extrabold leading-none text-white">
        +4
      </span>
      <span className="mt-0.5 text-[9px] font-medium uppercase tracking-wider text-white/60">
        нутриента
      </span>
    </div>
  );
}
