"use server";

import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { SETTINGS_ID, SETTINGS_TAG } from "@/lib/settings";

export type SettingsState = {
  error?: string;
  ok?: boolean;
};

export async function updateSiteSettingsAction(
  _prev: SettingsState,
  formData: FormData,
): Promise<SettingsState> {
  const admin = await requireAdmin();
  if (!admin) return { error: "Нямаш достъп." };

  const promoEnabled = formData.get("promoEnabled") === "on";
  const promoText = String(formData.get("promoText") ?? "").trim();

  if (promoEnabled && !promoText) {
    return { error: "Добави текст за лентата, преди да я включиш." };
  }

  await prisma.siteSettings.upsert({
    where: { id: SETTINGS_ID },
    update: { promoEnabled, promoText },
    create: { id: SETTINGS_ID, promoEnabled, promoText },
  });

  revalidateTag(SETTINGS_TAG, "max");
  return { ok: true };
}
