/**
 * "Направи теста" — magnesium lifestyle quiz.
 *
 * Purely a marketing/education tool: maps a stated goal + lifestyle
 * circumstances to the relevant (already EFSA-authorised) magnesium claims
 * and the Neuromag 6 forms that speak to them. This is NOT a diagnostic
 * instrument and must never be framed as detecting a deficiency — see the
 * disclaimer shown on the result screen and in MagnesiumNeed.tsx.
 */

export type QuizCategoryId = "sleep" | "stress" | "energy" | "recovery";

export type QuizCategory = {
  id: QuizCategoryId;
  label: string;
  intro: string;
  efsaClaims: string[];
  ingredientSlugs: string[];
};

export const quizCategories: Record<QuizCategoryId, QuizCategory> = {
  sleep: {
    id: "sleep",
    label: "Сън и възстановяване",
    intro:
      "Посочи качествения сън като приоритет. Магнезият участва в регулацията на нервната система, а Neuromag 6 съчетава форми, избрани именно с това предвид.",
    efsaClaims: [
      "Магнезият допринася за нормалната функция на нервната система",
      "Магнезият допринася за нормалните психологични функции",
    ],
    ingredientSlugs: ["magnezievo-l-treonat", "magnezievo-bisglicinat"],
  },
  stress: {
    id: "stress",
    label: "Спокойствие и устойчивост на стрес",
    intro:
      "Стресови периоди и натоварен график изразходват магнезий по-бързо. Комбинацията от форми в Neuromag 6 е изградена за постоянна, а не еднократна подкрепа.",
    efsaClaims: [
      "Магнезият допринася за нормалните психологични функции",
      "Магнезият допринася за намаляването на чувството на умора и отпадналост",
    ],
    ingredientSlugs: ["magnezievo-bisglicinat", "magnezievo-taurat"],
  },
  energy: {
    id: "energy",
    label: "Енергия през деня",
    intro:
      "Търсиш по-стабилна енергия, не рязък тласък. Магнезият участва пряко в енергийния метаболизъм на клетката.",
    efsaClaims: [
      "Магнезият допринася за нормалния енергиен метаболизъм",
      "Магнезият допринася за намаляването на чувството на умора и отпадналост",
    ],
    ingredientSlugs: ["magnezievo-malat", "magnezievo-citrat"],
  },
  recovery: {
    id: "recovery",
    label: "Възстановяване след тренировка",
    intro:
      "Редовните тренировки увеличават нуждата от магнезий заради загубите с потта и натоварването на мускулите. Формулата съчетава форми, свързани с мускулна и клетъчна функция.",
    efsaClaims: [
      "Магнезият допринася за нормалната мускулна функция",
      "Магнезият допринася за електролитния баланс",
    ],
    ingredientSlugs: ["magnezievo-malat", "magnezievo-orotat"],
  },
};

export type QuizOption = {
  id: string;
  label: string;
  /** Points added per category when this option is chosen. */
  weights: Partial<Record<QuizCategoryId, number>>;
};

export type QuizQuestion = {
  id: string;
  question: string;
  multi?: boolean;
  options: QuizOption[];
};

export const quizQuestions: QuizQuestion[] = [
  {
    id: "goal",
    question: "Каква е основната ти цел?",
    options: [
      { id: "sleep", label: "По-качествен сън", weights: { sleep: 3 } },
      {
        id: "stress",
        label: "Спокойствие при стрес",
        weights: { stress: 3 },
      },
      { id: "energy", label: "Стабилна енергия през деня", weights: { energy: 3 } },
      {
        id: "recovery",
        label: "По-бързо възстановяване след тренировка",
        weights: { recovery: 3 },
      },
    ],
  },
  {
    id: "lifestyle",
    question: "Кое от изброените описва ежедневието ти? Избери всички, които важат.",
    multi: true,
    options: [
      {
        id: "training",
        label: "Тренирам редовно (3+ пъти седмично)",
        weights: { recovery: 2, energy: 1 },
      },
      {
        id: "stress_period",
        label: "Имам стресова работа или период",
        weights: { stress: 2 },
      },
      {
        id: "caffeine",
        label: "Пия кафе или алкохол ежедневно",
        weights: { sleep: 1, energy: 1 },
      },
      {
        id: "restrictive_diet",
        label: "Следвам кето, нисковъглехидратен или друг ограничителен режим",
        weights: { energy: 1, recovery: 1 },
      },
      {
        id: "over_50",
        label: "На повече от 50 години съм",
        weights: { sleep: 1, recovery: 1 },
      },
    ],
  },
  {
    id: "current_use",
    question: "Приемаш ли в момента магнезий?",
    options: [
      { id: "none", label: "Не приемам", weights: {} },
      {
        id: "single_form",
        label: "Да, една форма (напр. цитрат или оксид)",
        weights: {},
      },
      { id: "multi_form", label: "Да, комбинирана добавка", weights: {} },
    ],
  },
  {
    id: "priority",
    question: "Кое тежи най-много при избор на добавка?",
    options: [
      { id: "quality", label: "Качество и биодостъпност на съставките", weights: {} },
      { id: "transparency", label: "Прозрачност на дозите", weights: {} },
      { id: "science", label: "Научна обоснованост", weights: {} },
      { id: "price", label: "Цена", weights: {} },
    ],
  },
];

/** Answers keyed by question id → selected option id(s). */
export type QuizAnswers = Record<string, string | string[]>;

export function scoreQuiz(answers: QuizAnswers): QuizCategoryId {
  const scores: Record<QuizCategoryId, number> = {
    sleep: 0,
    stress: 0,
    energy: 0,
    recovery: 0,
  };

  for (const question of quizQuestions) {
    const raw = answers[question.id];
    if (!raw) continue;
    const selected = Array.isArray(raw) ? raw : [raw];
    for (const optionId of selected) {
      const option = question.options.find((o) => o.id === optionId);
      if (!option) continue;
      for (const [cat, points] of Object.entries(option.weights)) {
        scores[cat as QuizCategoryId] += points ?? 0;
      }
    }
  }

  let best: QuizCategoryId = "sleep";
  let bestScore = -Infinity;
  for (const cat of Object.keys(scores) as QuizCategoryId[]) {
    if (scores[cat] > bestScore) {
      bestScore = scores[cat];
      best = cat;
    }
  }
  return best;
}
