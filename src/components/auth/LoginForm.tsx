"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction, type AuthState } from "@/lib/actions/auth";
import { Field } from "@/components/auth/Field";

const initialState: AuthState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

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
      <Field
        label="Парола"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        error={state.fieldErrors?.password}
      />

      <div className="text-right">
        <Link
          href="/zabravena-parola"
          className="text-sm text-brand-navy-500/60 hover:text-brand-navy-500"
        >
          Забравена парола?
        </Link>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-brand-navy-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-navy-700 disabled:opacity-60"
      >
        {pending ? "Влизане…" : "Вход"}
      </button>

      <p className="text-center text-sm text-brand-navy-500/60">
        Нямаш акаунт?{" "}
        <Link
          href="/registraciya"
          className="font-semibold text-brand-navy-500 underline"
        >
          Създай акаунт
        </Link>
      </p>
    </form>
  );
}
