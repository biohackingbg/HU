"use client";

import { useActionState } from "react";
import Link from "next/link";
import { forgotPasswordAction, type AuthState } from "@/lib/actions/auth";
import { Field } from "@/components/auth/Field";

const initialState: AuthState = {};

export function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(
    forgotPasswordAction,
    initialState,
  );

  if (state.ok) {
    return (
      <div className="space-y-4 text-center">
        <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          Ако съществува акаунт с този имейл, изпратихме връзка за
          възстановяване на паролата. Провери пощата си.
        </p>
        <Link
          href="/vhod"
          className="inline-block text-sm font-semibold text-brand-navy-500 underline"
        >
          Обратно към вход
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      {state.error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {state.error}
        </p>
      )}

      <Field
        label="Имейл"
        name="email"
        type="email"
        autoComplete="email"
        required
        error={state.fieldErrors?.email}
      />

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-brand-navy-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-navy-700 disabled:opacity-60"
      >
        {pending ? "Изпращане…" : "Изпрати връзка за възстановяване"}
      </button>

      <p className="text-center text-sm text-brand-navy-500/60">
        <Link href="/vhod" className="font-semibold text-brand-navy-500 underline">
          Обратно към вход
        </Link>
      </p>
    </form>
  );
}
