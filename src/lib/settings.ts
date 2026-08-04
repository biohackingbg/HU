import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";

export const SETTINGS_ID = "main";
export const SETTINGS_TAG = "site-settings";

export type SiteSettings = {
  promoEnabled: boolean;
  promoText: string;
};

const DEFAULTS: SiteSettings = { promoEnabled: false, promoText: "" };

/**
 * Cached read of the settings row. Deliberately has no try/catch: a failed
 * read must reject so it is *not* written to the cache. The time-based
 * revalidate is a safety net in case a tag revalidation is ever missed.
 */
const readSettings = unstable_cache(
  async (): Promise<SiteSettings> => {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: SETTINGS_ID },
    });
    return {
      promoEnabled: settings?.promoEnabled ?? DEFAULTS.promoEnabled,
      promoText: settings?.promoText ?? DEFAULTS.promoText,
    };
  },
  ["site-settings"],
  { tags: [SETTINGS_TAG], revalidate: 300 },
);

/**
 * Read sitewide settings for the root layout. Falls back to defaults when the
 * database is unreachable — the promo bar is decoration and must never take
 * the whole site down. The fallback is returned but never cached, so the bar
 * reappears on the next successful read instead of being stuck off.
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    return await readSettings();
  } catch (err) {
    console.error("[site-settings] read failed:", err);
    return DEFAULTS;
  }
}
