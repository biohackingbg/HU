"use client";

import { useActionState, useState } from "react";
import {
  updateSiteSettingsAction,
  type SettingsState,
} from "@/lib/actions/settings";

export function PromoSettingsForm({
  promoEnabled,
  promoText,
}: {
  promoEnabled: boolean;
  promoText: string;
}) {
  const [state, formAction, pending] = useActionState<SettingsState, FormData>(
    updateSiteSettingsAction,
    {},
  );
  const [enabled, setEnabled] = useState(promoEnabled);
  const [text, setText] = useState(promoText);

  return (
    <form action={formAction} className="max-w-2xl">
      <div className="rounded-2xl border border-brand-navy-500/10 bg-white p-6">
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            name="promoEnabled"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
            className="h-4 w-4 rounded border-brand-navy-500/30 accent-brand-navy-500"
          />
          <span className="text-sm font-semibold text-brand-navy-500">
            Покажи промо лентата
          </span>
        </label>
        <p className="mt-1.5 pl-7 text-sm text-brand-navy-500/55">
          Лентата се показва най-горе на всички страници от сайта.
        </p>

        <div className="mt-6">
          <label
            htmlFor="promoText"
            className="block text-xs font-semibold uppercase tracking-wide text-brand-navy-500/50"
          >
            Текст в лентата
          </label>
          <input
            id="promoText"
            name="promoText"
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={160}
            placeholder="напр. -15% на първата поръчка с код UPGRADE15"
            className="mt-2 w-full rounded-xl border border-brand-navy-500/15 px-4 py-3 text-sm text-brand-navy-500 outline-none focus:border-brand-navy-500/40"
          />
          <p className="mt-1.5 text-xs text-brand-navy-500/45">
            {text.length}/160 знака
          </p>
        </div>

        {text && (
          <div className="mt-6">
            <span className="block text-xs font-semibold uppercase tracking-wide text-brand-navy-500/50">
              Преглед
            </span>
            <div className="mt-2 flex items-center justify-center gap-3 rounded-xl bg-brand-navy-500 px-6 py-2.5 text-center text-sm font-medium text-white">
              <span className="text-[#0088FF]" aria-hidden="true">
                ✦
              </span>
              <span>{text}</span>
            </div>
          </div>
        )}

        {state.error && (
          <p className="mt-4 text-sm text-red-600">{state.error}</p>
        )}
        {state.ok && (
          <p className="mt-4 text-sm text-emerald-600">Настройките са запазени.</p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="mt-6 rounded-full bg-brand-navy-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-navy-700 disabled:opacity-50"
        >
          {pending ? "Запазване…" : "Запази"}
        </button>
      </div>
    </form>
  );
}
