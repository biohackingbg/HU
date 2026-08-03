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
 * Read sitewide settings. Cached until the settings tag is revalidated, so
 * the root layout doesn't hit the database on every request. Falls back to
 * defaults if the database is unreachable — the promo bar is decoration and
 * must never take the whole site down with it.
 */
export const getSiteSettings = unstable_cache(
  async (): Promise<SiteSettings> => {
    try {
      const settings = await prisma.siteSettings.findUnique({
        where: { id: SETTINGS_ID },
      });
      return {
        promoEnabled: settings?.promoEnabled ?? DEFAULTS.promoEnabled,
        promoText: settings?.promoText ?? DEFAULTS.promoText,
      };
    } catch {
      return DEFAULTS;
    }
  },
  ["site-settings"],
  { tags: [SETTINGS_TAG] },
);
