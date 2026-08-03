"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { CheckItem } from "@/components/ui/CheckItem";
import { submitQuizLead, type QuizLeadState } from "@/lib/actions/quiz";
import {
  quizCategories,
  quizQuestions,
  scoreQuiz,
  type QuizAnswers,
} from "@/lib/quiz";
import { QUIZ_PROMO_CODE } from "@/lib/promo";
import { ingredients } from "@/lib/ingredients";

const initialLeadState: QuizLeadState = {};

export function QuizFlow() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const total = quizQuestions.length;
  const done = step >= total;

  const question = quizQuestions[step];
  const currentAnswer = question ? answers[question.id] : undefined;
  const canContinue = question
    ? question.multi
      ? Array.isArray(currentAnswer) && currentAnswer.length > 0
      : typeof currentAnswer === "string" && currentAnswer.length > 0
    : false;

  function selectSingle(questionId: string, optionId: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  }

  function toggleMulti(questionId: string, optionId: string) {
    setAnswers((prev) => {
      const existing = prev[questionId];
      const arr = Array.isArray(existing) ? existing : [];
      const next = arr.includes(optionId)
        ? arr.filter((id) => id !== optionId)
        : [...arr, optionId];
      return { ...prev, [questionId]: next };
    });
  }

  if (done) {
    return <QuizResult answers={answers} onRestart={() => { setAnswers({}); setStep(0); }} />;
  }

  return (
    <div className="mx-auto max-w-xl">
      {/* Progress */}
      <div className="mb-8 flex items-center gap-2">
        {quizQuestions.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full ${
              i <= step ? "bg-brand-navy-500" : "bg-brand-navy-500/10"
            }`}
          />
        ))}
      </div>

      <p className="text-sm font-semibold uppercase tracking-wider text-brand-sky-600">
        Въпрос {step + 1} от {total}
      </p>
      <h1 className="mt-2 font-display text-2xl font-extrabold text-brand-navy-500 sm:text-3xl">
        {question.question}
      </h1>
      {question.multi && (
        <p className="mt-1 text-sm text-brand-navy-500/50">
          Можеш да избереш повече от един отговор.
        </p>
      )}

      <div className="mt-6 space-y-2.5">
        {question.options.map((option) => {
          const selected = question.multi
            ? Array.isArray(currentAnswer) && currentAnswer.includes(option.id)
            : currentAnswer === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() =>
                question.multi
                  ? toggleMulti(question.id, option.id)
                  : selectSingle(question.id, option.id)
              }
              className={`flex w-full items-center gap-3 rounded-2xl border px-5 py-4 text-left transition-colors ${
                selected
                  ? "border-brand-navy-500 bg-brand-sky-50"
                  : "border-brand-navy-500/15 hover:border-brand-navy-500/30"
              }`}
            >
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                  question.multi ? "rounded-md" : ""
                } ${
                  selected
                    ? "border-brand-navy-500 bg-brand-navy-500"
                    : "border-brand-navy-500/25"
                }`}
              >
                {selected && (
                  <svg viewBox="0 0 20 20" fill="none" className="h-3 w-3">
                    <path
                      d="M4 10.5l3.5 3.5L16 5.5"
                      stroke="white"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </span>
              <span className="font-medium text-brand-navy-500">
                {option.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="text-sm font-medium text-brand-navy-500/60 hover:text-brand-navy-500 disabled:opacity-0"
        >
          ← Назад
        </button>
        <Button
          onClick={() => setStep((s) => s + 1)}
          className={!canContinue ? "pointer-events-none opacity-40" : ""}
        >
          {step === total - 1 ? "Виж резултата" : "Продължи"}
        </Button>
      </div>
    </div>
  );
}

function QuizResult({
  answers,
  onRestart,
}: {
  answers: QuizAnswers;
  onRestart: () => void;
}) {
  const categoryId = useMemo(() => scoreQuiz(answers), [answers]);
  const category = quizCategories[categoryId];
  const relatedIngredients = ingredients.filter((i) =>
    category.ingredientSlugs.includes(i.slug),
  );

  const [leadState, leadAction, leadPending] = useActionState(
    submitQuizLead,
    initialLeadState,
  );

  // Remember the earned code so it survives PDP → cart → checkout.
  useEffect(() => {
    try {
      localStorage.setItem("hu_quiz_promo", QUIZ_PROMO_CODE);
    } catch {
      // ignore storage errors (private mode, etc.)
    }
  }, []);

  return (
    <div className="mx-auto max-w-2xl">
      <span className="font-display text-sm font-semibold uppercase tracking-wider text-brand-sky-600">
        Твоят резултат
      </span>
      <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-brand-navy-500 sm:text-4xl">
        {category.label}
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-brand-navy-500/75">
        {category.intro}
      </p>

      <div className="mt-8 rounded-3xl bg-brand-sky-50 p-6 sm:p-8">
        <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-brand-sky-600">
          Официални здравни твърдения (EFSA)
        </h2>
        <ul className="mt-4 space-y-2.5">
          {category.efsaClaims.map((claim) => (
            <CheckItem key={claim}>{claim}</CheckItem>
          ))}
        </ul>

        {relatedIngredients.length > 0 && (
          <>
            <h2 className="mt-6 font-display text-sm font-semibold uppercase tracking-wider text-brand-sky-600">
              Форми в Neuromag 6, свързани с това
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {relatedIngredients.map((ing) => (
                <Link
                  key={ing.slug}
                  href={`/sustavki/${ing.slug}`}
                  className="rounded-full bg-white px-4 py-2 text-sm font-medium text-brand-navy-500 ring-1 ring-brand-navy-500/10 transition-colors hover:ring-brand-navy-500/30"
                >
                  {ing.name}
                </Link>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Promo */}
      <div className="mt-6 flex items-center justify-between rounded-2xl border border-brand-navy-500/10 p-5">
        <div>
          <p className="text-sm text-brand-navy-500/60">
            Код за 10% от първата ти поръчка
          </p>
          <p className="font-display text-lg font-extrabold text-brand-navy-500">
            {QUIZ_PROMO_CODE}
          </p>
        </div>
        <span className="text-xs text-brand-navy-500/45">
          Прилага се автоматично при плащане
        </span>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button href="/produkt/neuromag-6">Разгледай Neuromag 6™</Button>
        <button
          type="button"
          onClick={onRestart}
          className="rounded-full border border-brand-navy-500/15 px-6 py-3 text-sm font-semibold text-brand-navy-500 hover:border-brand-navy-500/40"
        >
          Направи теста отново
        </button>
      </div>

      {/* Optional email capture */}
      <div className="mt-8 rounded-2xl bg-brand-navy-500 p-6 sm:p-7">
        {leadState.ok ? (
          <p className="text-white">
            Изпратихме резултата и кода на имейла ти.
          </p>
        ) : (
          <form action={leadAction} className="sm:flex sm:items-end sm:gap-3">
            <input type="hidden" name="category" value={categoryId} />
            <div className="flex-1">
              <label className="text-sm font-medium text-white/80">
                Изпрати резултата на имейла си (незадължително)
              </label>
              <input
                name="email"
                type="email"
                placeholder="име@имейл.bg"
                className="mt-1.5 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-white outline-none transition-colors placeholder:text-white/40 focus:border-white/50"
              />
              {leadState.fieldErrors?.email && (
                <p className="mt-1.5 text-sm text-red-300">
                  {leadState.fieldErrors.email}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={leadPending}
              className="mt-3 w-full shrink-0 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-brand-navy-500 transition-colors hover:bg-brand-sky-100 disabled:opacity-60 sm:mt-0 sm:w-auto"
            >
              {leadPending ? "…" : "Изпрати"}
            </button>
          </form>
        )}
        {leadState.error && (
          <p className="mt-2 text-sm text-red-300">{leadState.error}</p>
        )}
      </div>

      <p className="mt-8 text-xs leading-relaxed text-brand-navy-500/45">
        Тестът е с образователна и маркетингова цел — не поставя диагноза и не
        измерва нивата на магнезий в организма ти. Единственият начин да
        разбереш действителните си стойности е кръвно изследване. При
        съмнение за дефицит се консултирай с лекар.
      </p>
    </div>
  );
}
