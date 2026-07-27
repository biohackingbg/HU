"use client";

import { useActionState } from "react";
import { joinBloodWaitlist, type WaitlistState } from "@/lib/actions/blood";

const initialState: WaitlistState = {};

export function WaitlistForm() {
  const [state, formAction, pending] = useActionState(
    joinBloodWaitlist,
    initialState,
  );

  if (state.ok) {
    return (
      <p className="rounded-2xl bg-white/10 px-5 py-4 text-center text-sm text-white">
        Благодарим — ще те уведомим първи при пускането на услугата.
      </p>
    );
  }

  return (
    <form action={formAction} className="w-full max-w-md">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          name="email"
          required
          placeholder="твоят@имейл.bg"
          aria-label="Имейл"
          className="flex-1 rounded-full border border-white/20 bg-white/10 px-5 py-3 text-white outline-none transition-colors placeholder:text-white/40 focus:border-white/60"
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-navy-500 transition-colors hover:bg-brand-sky-100 disabled:opacity-60"
        >
          {pending ? "Записване…" : "Уведоми ме"}
        </button>
      </div>
      {(state.fieldErrors?.email || state.error) && (
        <p className="mt-2 text-sm text-amber-300">
          {state.fieldErrors?.email ?? state.error}
        </p>
      )}
      <p className="mt-3 text-xs leading-relaxed text-white/45">
        Използваме имейла само за да те уведомим при пускането на услугата.
        Виж{" "}
        <a href="/poveritelnost" className="underline">
          политиката за поверителност
        </a>
        .
      </p>
    </form>
  );
}
