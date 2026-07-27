"use client";

import { useActionState } from "react";
import { moderateReviewAction, type ReviewState } from "@/lib/actions/reviews";

const initialState: ReviewState = {};

export function ModerateReviewButtons({
  id,
  status,
}: {
  id: string;
  status: string;
}) {
  const [state, formAction, pending] = useActionState(
    moderateReviewAction,
    initialState,
  );

  return (
    <form action={formAction} className="flex items-center gap-2">
      <input type="hidden" name="id" value={id} />
      {state.error && (
        <span className="text-xs text-red-600">{state.error}</span>
      )}
      {status !== "approved" && (
        <button
          type="submit"
          name="action"
          value="approve"
          disabled={pending}
          className="rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
        >
          Одобри
        </button>
      )}
      {status !== "rejected" && (
        <button
          type="submit"
          name="action"
          value="reject"
          disabled={pending}
          className="rounded-full border border-brand-navy-500/15 px-4 py-1.5 text-xs font-semibold text-brand-navy-500/70 hover:border-red-300 hover:text-red-600 disabled:opacity-60"
        >
          Отхвърли
        </button>
      )}
    </form>
  );
}
