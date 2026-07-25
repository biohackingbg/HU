"use client";

import { useActionState } from "react";
import Link from "next/link";
import { resetPasswordAction, type AuthState } from "@/lib/actions/auth";
import { Field } from "@/components/auth/Field";

const initialState: AuthState = {};

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, formAction, pending] = useActionState(
    resetPasswordAction,
    initialState,
  );

  if (state.ok) {
    return (
      <div className="space-y-4 text-center">
        <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          Паролата е сменена успешно. Вече можеш да влезеш с новата парола.
        </p>
        <Link
          href="/vhod"
          className="inline-flex rounded-full bg-brand-navy-500 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-navy-700"
        >
          Към вход
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="token" value={token} />

      {state.error && (
        <div className="space-y-3">
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {state.error}
          </p>
          <Link
            href="/zabravena-parola"
            className="inline-block text-sm font-semibold text-brand-navy-500 underline"
          >
            Заяви нова връзка
          </Link>
        </div>
      )}

      <Field
        label="Нова парола"
        name="newPassword"
        type="password"
        autoComplete="new-password"
        required
        error={state.fieldErrors?.newPassword}
      />
      <Field
        label="Потвърди новата парола"
        name="confirmPassword"
        type="password"
        autoComplete="new-password"
        required
        error={state.fieldErrors?.confirmPassword}
      />

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-brand-navy-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-navy-700 disabled:opacity-60"
      >
        {pending ? "Смяна…" : "Задай нова парола"}
      </button>
    </form>
  );
}
