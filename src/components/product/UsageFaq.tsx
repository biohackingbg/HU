const faqs = [
  {
    q: "Мога ли да приемам Neuromag 6 всеки ден?",
    a: "Да, продуктът е предназначен за ежедневна употреба в рамките на препоръчителната доза от 2 до 4 капсули дневно, с храна и вода.",
  },
  {
    q: "Ще предизвика ли храносмилателен дискомфорт?",
    a: "Комбинацията от 6 форми е избрана и заради по-добрата им поносимост в сравнение с еднокомпонентни форми като магнезиев оксид. Ако сте чувствителни, можете да започнете с 1 капсула дневно и постепенно да достигнете препоръчителната доза.",
  },
  {
    q: "Мога ли да го комбинирам с други добавки или лекарства?",
    a: "Ако приемате лекарства или имате хронично заболяване, консултирайте се с лекар или фармацевт преди прием, особено при бъбречно заболяване или лечение с антибиотици от групата на тетрациклините.",
  },
  {
    q: "Кога да очаквам резултат?",
    a: "Магнезиевият статус се възстановява постепенно. Повечето хора отчитат подобрение в отпускането и съня в рамките на 2–4 седмици редовен прием.",
  },
];

export function UsageFaq() {
  return (
    <div className="divide-y divide-brand-navy-500/10 rounded-2xl border border-brand-navy-500/10">
      {faqs.map((faq) => (
        <details key={faq.q} className="group p-6">
          <summary className="flex cursor-pointer list-none items-center justify-between font-display font-semibold text-brand-navy-500 marker:content-none">
            {faq.q}
            <span className="ml-4 shrink-0 text-brand-navy-500/40 transition-transform group-open:rotate-45">
              +
            </span>
          </summary>
          <p className="mt-3 leading-relaxed text-brand-navy-500/70">
            {faq.a}
          </p>
        </details>
      ))}
    </div>
  );
}
