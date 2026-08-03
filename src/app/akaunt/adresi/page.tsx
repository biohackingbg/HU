import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function AddressesPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const addresses = await prisma.address.findMany({
    where: { userId: user.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }],
  });

  return (
    <div>
      <h2 className="font-display text-lg font-extrabold text-brand-navy-500">
        Адреси за доставка
      </h2>

      {addresses.length === 0 ? (
        <div className="mt-4 rounded-3xl border border-brand-navy-500/10 bg-white p-8 text-center">
          <p className="text-brand-navy-500/60">
            Все още нямаш запазени адреси. Ще можеш да добавиш адрес при
            първата си поръчка.
          </p>
        </div>
      ) : (
        <ul className="mt-4 grid gap-4 sm:grid-cols-2">
          {addresses.map((address) => (
            <li
              key={address.id}
              className="rounded-2xl border border-brand-navy-500/10 bg-white p-5"
            >
              <div className="flex items-center justify-between">
                <p className="font-semibold text-brand-navy-500">
                  {address.label ?? "Адрес"}
                </p>
                {address.isDefault && (
                  <span className="rounded-full bg-brand-sky-100 px-2.5 py-0.5 text-xs font-semibold text-brand-sky-700">
                    Основен
                  </span>
                )}
              </div>
              <address className="mt-2 not-italic text-sm leading-relaxed text-brand-navy-500/70">
                {address.fullName}
                <br />
                {address.line1}
                {address.line2 ? (
                  <>
                    <br />
                    {address.line2}
                  </>
                ) : null}
                <br />
                {address.postcode} {address.city}
                {address.phone ? (
                  <>
                    <br />
                    тел. {address.phone}
                  </>
                ) : null}
              </address>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
