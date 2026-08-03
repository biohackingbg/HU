import { PromoSettingsForm } from "@/components/admin/PromoSettingsForm";
import { getSiteSettings } from "@/lib/settings";

export default async function AdminSettingsPage() {
  const { promoEnabled, promoText } = await getSiteSettings();

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-brand-navy-500">
          Настройки
        </h1>
        <p className="mt-1 text-sm text-brand-navy-500/55">
          Промо лента в горния край на сайта.
        </p>
      </div>

      <PromoSettingsForm promoEnabled={promoEnabled} promoText={promoText} />
    </div>
  );
}
