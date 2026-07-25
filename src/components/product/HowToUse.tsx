export function HowToUse() {
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="rounded-2xl bg-brand-sky-50 p-6">
        <span className="font-display text-sm font-semibold uppercase tracking-wider text-brand-sky-600">
          Препоръчителен дневен прием
        </span>
        <p className="mt-3 text-2xl font-bold text-brand-navy-500">
          2 капсули дневно
        </p>
        <p className="mt-1 text-brand-navy-500/60">с храна и вода</p>
      </div>

      <div className="rounded-2xl bg-brand-sky-50 p-6">
        <span className="font-display text-sm font-semibold uppercase tracking-wider text-brand-sky-600">
          При повишени нужди
        </span>
        <p className="mt-3 text-2xl font-bold text-brand-navy-500">
          до 4 капсули дневно
        </p>
        <p className="mt-1 text-brand-navy-500/60">
          разделени сутрин и вечер
        </p>
      </div>

      <div className="lg:col-span-2">
        <p className="text-sm leading-relaxed text-brand-navy-500/60">
          Да не се превишава препоръчителната дневна доза. Хранителната
          добавка не трябва да се използва като заместител на разнообразното
          и балансирано хранене и здравословния начин на живот. Да се
          съхранява на сухо и хладно място, недостъпно за малки деца.
        </p>
      </div>
    </div>
  );
}
