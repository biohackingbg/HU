"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerAction, type AuthState } from "@/lib/actions/auth";
import { Field } from "@/components/auth/Field";

const initialState: AuthState = {};

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(
    registerAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-5">
      {state.error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {state.error}
        </p>
      )}

      <div className="grid grid-cols-2 gap-4">
        <Field label="Име" name="firstName" autoComplete="given-name" />
        <Field label="Фамилия" name="lastName" autoComplete="family-name" />
      </div>

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
        autoComplete="new-password"
        required
        error={state.fieldErrors?.password}
        placeholder="Поне 8 символа"
      />

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-brand-navy-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-navy-700 disabled:opacity-60"
      >
        {pending ? "Създаване…" : "Създай акаунт"}
      </button>

      <p className="text-center text-xs leading-relaxed text-brand-navy-500/50">
        Създавайки акаунт, приемаш{" "}
        <Link href="/obshti-usloviya" className="underline">
          Общите условия
        </Link>{" "}
        и{" "}
        <Link href="/poveritelnost" className="underline">
          Политиката за поверителност
        </Link>
        .
      </p>

      <p className="text-center text-sm text-brand-navy-500/60">
        Вече имаш акаунт?{" "}
        <Link
          href="/vhod"
          className="font-semibold text-brand-navy-500 underline"
        >
          Влез
        </Link>
      </p>
    </form>
  );
}
