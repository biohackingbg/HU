"use client";

import { useActionState } from "react";
import { updateProfileAction, type AuthState } from "@/lib/actions/auth";
import { Field } from "@/components/auth/Field";

const initialState: AuthState = {};

export function ProfileForm({
  firstName,
  lastName,
}: {
  firstName: string;
  lastName: string;
}) {
  const [state, formAction, pending] = useActionState(
    updateProfileAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-5">
      {state.ok && (
        <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          Промените са запазени.
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Име"
          name="firstName"
          autoComplete="given-name"
          defaultValue={firstName}
        />
        <Field
          label="Фамилия"
          name="lastName"
          autoComplete="family-name"
          defaultValue={lastName}
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-brand-navy-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-navy-700 disabled:opacity-60"
      >
        {pending ? "Запазване…" : "Запази промените"}
      </button>
    </form>
  );
}
