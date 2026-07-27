/**
 * Health Upgrade Blood — BETA mockup data.
 *
 * Everything here is placeholder content for design/partner review. Replace
 * with the real lab partner's panel, pricing and turnaround once contracts
 * and regulatory approval are in place. No diagnostic claims are made.
 */

export const bloodMeta = {
  // Derived from biomarkerGroups below so the two can never disagree.
  get markerCount() {
    return biomarkerGroups.reduce((sum, g) => sum + g.markers.length, 0);
  },
  fromPriceEur: 89,
  turnaroundHours: 72,
};

export type BloodStep = {
  n: number;
  title: string;
  body: string;
};

export const bloodSteps: BloodStep[] = [
  {
    n: 1,
    title: "Вземане на проба у дома",
    body: "Комплект, доставен до адрес или офис на Еконт. Взимаш пробата вкъщи за минути и я връщаш с предплатен плик до партньорската лаборатория.",
  },
  {
    n: 2,
    title: "Резултати до 72 часа",
    body: "Получаваш резултатите в личния си профил — всеки показател обяснен на разбираем български: какво означава и защо е важен.",
  },
  {
    n: 3,
    title: "Персонализирани препоръки",
    body: "Виждаш кои показатели са извън оптималния диапазон и кои продукти и навици биха имали най-голямо значение конкретно за теб.",
  },
  {
    n: 4,
    title: "Проследяване във времето",
    body: "Повтори теста след няколко месеца и виж как се променят стойностите ти — за да знаеш кое наистина работи.",
  },
];

/** Sample gauge values shown in the "how it works" preview. */
export const sampleMarkers = [
  {
    name: "Витамин D",
    value: 28,
    unit: "nmol/L",
    min: 0,
    max: 150,
    optimalFrom: 75,
    optimalTo: 125,
    status: "low" as const,
  },
  {
    name: "Феритин",
    value: 96,
    unit: "µg/L",
    min: 0,
    max: 300,
    optimalFrom: 50,
    optimalTo: 150,
    status: "optimal" as const,
  },
  {
    name: "Магнезий",
    value: 0.74,
    unit: "mmol/L",
    min: 0.5,
    max: 1.2,
    optimalFrom: 0.85,
    optimalTo: 1.05,
    status: "low" as const,
  },
];

export type BiomarkerGroup = {
  group: string;
  markers: string[];
};

export const biomarkerGroups: BiomarkerGroup[] = [
  {
    group: "Сърце и метаболизъм",
    markers: [
      "Общ холестерол",
      "LDL холестерол",
      "HDL холестерол",
      "Не-HDL холестерол",
      "Триглицериди",
      "ApoB",
      "HbA1c",
      "Кръвна захар",
      "Инсулин",
    ],
  },
  {
    group: "Витамини и минерали",
    markers: [
      "Витамин D",
      "Витамин B12",
      "Фолат",
      "Магнезий",
      "Цинк",
      "Калий",
      "Натрий",
      "Калций",
    ],
  },
  {
    group: "Желязо и кръвна картина",
    markers: ["Феритин", "Желязо", "Трансферин", "Хемоглобин", "Хематокрит"],
  },
  {
    group: "Хормони",
    markers: [
      "TSH",
      "Свободен T4",
      "Свободен T3",
      "Общ тестостерон",
      "Свободен тестостерон",
      "SHBG",
      "Естрадиол",
      "Кортизол",
    ],
  },
  {
    group: "Черен дроб и бъбреци",
    markers: [
      "ALT",
      "AST",
      "GGT",
      "Алкална фосфатаза",
      "Билирубин",
      "Албумин",
      "Креатинин",
      "eGFR",
      "Урея",
    ],
  },
  {
    group: "Възпаление",
    markers: ["CRP (високочувствителен)", "Пикочна киселина"],
  },
];

export type BloodPlan = {
  id: string;
  name: string;
  price: number;
  compareAt?: number;
  cadence: string;
  description: string;
  markerCount: string;
  features: string[];
  featured?: boolean;
};

export const bloodPlans: BloodPlan[] = [
  {
    id: "essential",
    name: "Essential",
    price: 89,
    cadence: "еднократно",
    description:
      "Основите: сърце, холестерол, витамини и чернодробни показатели.",
    markerCount: "24 показателя",
    features: ["Комплект за вземане у дома", "Резултати до 72 часа", "Дигитален профил с обяснения"],
  },
  {
    id: "complete",
    name: "Complete",
    price: 149,
    compareAt: 189,
    cadence: "еднократно",
    description:
      "Пълната картина, включително хормони, минерали и възпалителни маркери.",
    markerCount: `${bloodMeta.markerCount} показателя`,
    featured: true,
    features: [
      "Всичко от Essential",
      "Хормонален и минерален панел",
      "Персонализирани препоръки",
    ],
  },
  {
    id: "membership",
    name: "Membership",
    price: 269,
    cadence: "годишно",
    description: "За тези, които искат да проследяват промяната във времето.",
    markerCount: "2 × Complete годишно",
    features: [
      "2 теста Complete на година",
      "Сравнение на резултатите във времето",
      "Приоритетна доставка",
    ],
  },
];

export const includedInEvery = [
  "Комплект за вземане на проба у дома",
  `Резултати до ${bloodMeta.turnaroundHours} часа`,
  "Личен профил с обяснение на всеки показател",
  "Препоръки, съобразени с твоите стойности",
  "Проследяване на промяната при повторен тест",
];

export const bloodFaq = [
  {
    q: "Как се взема пробата?",
    a: "Комплектът съдържа всичко необходимо и подробна инструкция. Пробата се взема у дома за няколко минути и се връща с предплатен плик до партньорската лаборатория.",
  },
  {
    q: "Кой обработва пробата?",
    a: "Анализите се извършват от лицензирана партньорска лаборатория. Конкретният партньор ще бъде обявен при официалното пускане на услугата.",
  },
  {
    q: "Това диагностика ли е?",
    a: "Не. Резултатите имат информативен характер и не заместват медицинска консултация, диагноза или лечение. При отклонения в стойностите се консултирай с лекар.",
  },
  {
    q: "Какво се случва с данните ми?",
    a: "Здравните данни са специална категория лични данни. Обработват се само с твоето изрично съгласие, съхраняват се защитено и не се споделят с трети страни за маркетинг.",
  },
  {
    q: "Кога ще бъде достъпно?",
    a: "Услугата е в процес на разработка. Остави имейл, за да те уведомим първи при пускането.",
  },
];
