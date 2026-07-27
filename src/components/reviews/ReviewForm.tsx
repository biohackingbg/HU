"use client";

import { useActionState, useState } from "react";
import { submitReviewAction, type ReviewState } from "@/lib/actions/reviews";
import { Star } from "@/components/reviews/Stars";

const initialState: ReviewState = {};

export function ReviewForm({ productSlug }: { productSlug: string }) {
  const [state, formAction, pending] = useActionState(
    submitReviewAction,
    initialState,
  );
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  if (state.ok) {
    return (
      <div className="rounded-2xl bg-emerald-50 px-5 py-4 text-sm text-emerald-800">
        <p className="font-semibold">Благодарим за отзива!</p>
        <p className="mt-1">
          Ще го публикуваме след кратка проверка от наш екип.
        </p>
      </div>
    );
  }

  const shown = hover || rating;

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="productSlug" value={productSlug} />
      <input type="hidden" name="rating" value={rating} />

      {state.error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {state.error}
        </p>
      )}

      <div>
        <span className="block text-sm font-medium text-brand-navy-500">
          Твоята оценка
        </span>
        <div
          className="mt-2 flex items-center gap-1"
          onMouseLeave={() => setHover(0)}
        >
          {[1, 2, 3, 4, 5].map((i) => (
            <button
              key={i}
              type="button"
              aria-label={`${i} ${i === 1 ? "звезда" : "звезди"}`}
              aria-pressed={rating === i}
              onClick={() => setRating(i)}
              onMouseEnter={() => setHover(i)}
              className="rounded p-0.5 transition-transform hover:scale-110"
            >
              <Star filled={i <= shown} size={28} />
            </button>
          ))}
        </div>
        {state.fieldErrors?.rating && (
          <p className="mt-1.5 text-sm text-red-500">
            {state.fieldErrors.rating}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-brand-navy-500"
        >
          Заглавие <span className="text-brand-navy-500/45">(по избор)</span>
        </label>
        <input
          id="title"
          name="title"
          maxLength={120}
          placeholder="Обобщи опита си с една фраза"
          className="mt-1.5 w-full rounded-xl border border-brand-navy-500/15 bg-white px-4 py-2.5 text-brand-navy-500 outline-none transition-colors placeholder:text-brand-navy-500/35 focus:border-brand-navy-500"
        />
      </div>

      <div>
        <label
          htmlFor="body"
          className="block text-sm font-medium text-brand-navy-500"
        >
          Твоят отзив
        </label>
        <textarea
          id="body"
          name="body"
          rows={5}
          required
          placeholder="Как ти повлия продуктът? Колко време го приемаш?"
          className={`mt-1.5 w-full rounded-xl border bg-white px-4 py-2.5 text-brand-navy-500 outline-none transition-colors placeholder:text-brand-navy-500/35 focus:border-brand-navy-500 ${
            state.fieldErrors?.body
              ? "border-red-400"
              : "border-brand-navy-500/15"
          }`}
        />
        {state.fieldErrors?.body && (
          <p className="mt-1.5 text-sm text-red-500">
            {state.fieldErrors.body}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={pending || rating === 0}
        className="rounded-full bg-brand-navy-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-navy-700 disabled:opacity-50"
      >
        {pending ? "Изпращане…" : "Изпрати отзив"}
      </button>

      <p className="text-xs leading-relaxed text-brand-navy-500/45">
        Отзивите се публикуват след проверка. Публикуваме както положителни,
        така и отрицателни отзиви — премахваме само обиден или нерелевантен
        текст.
      </p>
    </form>
  );
}
