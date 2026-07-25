"use client";

import { useActionState, useEffect, useRef } from "react";
import { changePasswordAction, type AuthState } from "@/lib/actions/auth";
import { Field } from "@/components/auth/Field";

const initialState: AuthState = {};

export function ChangePasswordForm() {
  const [state, formAction, pending] = useActionState(
    changePasswordAction,
    initialState,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state.ok]);

  return (
    <form ref={formRef} action={formAction} className="space-y-5">
      {state.ok && (
        <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          Паролата е сменена успешно.
        </p>
      )}
      {state.error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {state.error}
        </p>
      )}

      <Field
        label="Текуща парола"
        name="currentPassword"
        type="password"
        autoComplete="current-password"
        required
        error={state.fieldErrors?.currentPassword}
      />
      <div className="grid gap-4 sm:grid-cols-2">
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
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-brand-navy-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-navy-700 disabled:opacity-60"
      >
        {pending ? "Смяна…" : "Смени паролата"}
      </button>
    </form>
  );
}
