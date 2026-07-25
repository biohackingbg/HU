export type HydraImage = { src: string; alt: string; width: number; height: number };

export type HydraFlavor = {
  id: string;
  name: string;
  note: string;
  swatch: string;
  images: HydraImage[];
};

export const hydraFlavors: HydraFlavor[] = [
  {
    id: "unflavored",
    name: "Без вкус",
    note: "чист електролитен профил, без подсладители",
    swatch: "#8FB03A",
    images: [
      {
        src: "/brand/hydra-plus-front.png",
        alt: "Health Upgrade Hydra+ Без вкус — предна страна",
        width: 1024,
        height: 1024,
      },
      {
        src: "/brand/hydra-plus-angle.png",
        alt: "Health Upgrade Hydra+ — студийна снимка под ъгъл",
        width: 1111,
        height: 1416,
      },
      {
        src: "/brand/hydra-plus-lifestyle.png",
        alt: "Health Upgrade Hydra+ — държан в ръка",
        width: 1060,
        height: 1484,
      },
    ],
  },
  {
    id: "citrus",
    name: "Цитрус",
    note: "лек цитрусов вкус, без захар",
    swatch: "#E8846B",
    images: [
      {
        src: "/brand/hydra-plus-citrus.png",
        alt: "Health Upgrade Hydra+ Цитрус — предна страна",
        width: 1024,
        height: 1024,
      },
    ],
  },
];

export const hydra = {
  slug: "hydra-plus",
  name: "Hydra+",
  tagline: "Hydrate. Recharge. Perform.",
  subtitle: "Daily Hydration System",
  scoops: 60,
  netWeight: "360 g",
  keyPoints: [
    "Ежедневна хидратация",
    "Електролитен баланс",
    "Премиум минерални форми",
    "Чисти съставки — без захар",
  ],
};

// „What dehydrates you every day?“
export const dehydrationFactors = [
  {
    icon: "coffee",
    label: "Кафе",
    note: "Кофеинът може да повиши нуждата от течности при някои хора.",
  },
  {
    icon: "plane",
    label: "Пътуване",
    note: "Сухият въздух в самолета може да допринесе за дехидратация.",
  },
  {
    icon: "dumbbell",
    label: "Тренировка",
    note: "Потта води до загуба на вода и електролити.",
  },
  {
    icon: "sauna",
    label: "Сауна",
    note: "Високите температури увеличават загубата на течности и електролити.",
  },
  {
    icon: "sun",
    label: "Топло време",
    note: "Топлият климат засилва изпотяването.",
  },
  {
    icon: "laptop",
    label: "Дълги офис дни",
    note: "Много хора просто не пият достатъчно вода през работния ден.",
  },
];

export const differencePillars = [
  {
    title: "Премиум електролити",
    body: "Балансирани натрий, калий и магнезий, които подкрепят хидратацията и електролитния баланс.",
  },
  {
    title: "Чиста формула",
    body: "Без захар. Без изкуствени оцветители. Без изкуствени подсладители. Без пълнители. Само внимателно подбрани съставки.",
  },
  {
    title: "За ежедневна употреба",
    body: "Не само за спортисти. Hydra+ е създаден за ежедневна хидратация — докато работиш, тренираш, пътуваш или просто искаш да останеш хидратиран.",
  },
];

export const whoForItems = [
  "Активни хора",
  "Офис служители",
  "Чести пътуващи",
  "Любители на кафе",
  "Посетители на сауна",
  "Нисковъглехидратен и кето режим",
  "Заети родители",
  "Всеки, който иска по-добра ежедневна хидратация",
];

export const whatsInside = [
  {
    name: "Натрий",
    role: "Основен електролит, който тялото губи чрез потта и участва във водно-солевия баланс.",
    claim: null,
  },
  {
    name: "Калий",
    role: "Допринася за нормалната функция на нервната система и за нормалната мускулна функция.",
    claim: "efsa",
  },
  {
    name: "Магнезий",
    role: "Допринася за електролитния баланс, за нормалната мускулна функция и за нормалните психологични функции.",
    claim: "efsa",
  },
  {
    name: "Микроелементи",
    role: "Естествено срещащи се минерали, които допълват електролитния профил.",
    claim: null,
  },
];

export const howToUseOccasions = [
  "Сутрешна хидратация",
  "Преди тренировка",
  "По време на натоварване",
  "След сауна",
  "По време на пътуване",
  "През целия ден",
];

export const cleanLabel = [
  "Без захар",
  "Без изкуствени подсладители",
  "Без изкуствени оцветители",
  "Без консерванти",
  "Без ГМО",
  "Веган",
  "Без глутен",
  "Без лактоза",
];

export const systemProducts = [
  {
    name: "Neuromag 6™",
    system: "Premium Nervous System Support",
    status: "live" as const,
    href: "/produkt/neuromag-6",
  },
  {
    name: "Hydra+",
    system: "Daily Hydration System",
    status: "current" as const,
    href: "/produkt/hydra-plus",
  },
  {
    name: "Metabolic+",
    system: "Metabolic System Support",
    status: "soon" as const,
  },
  {
    name: "Microbiome+",
    system: "Gut System Support",
    status: "soon" as const,
  },
];

export const hydraFaq = [
  {
    q: "Мога ли да пия Hydra+ всеки ден?",
    a: "Да. Hydra+ е създаден за ежедневна употреба като част от здравословен начин на живот.",
  },
  {
    q: "Само за спортисти ли е Hydra+?",
    a: "Не. Подходящ е за тренировки и физическа активност, но е също така идеален за всеки, който иска да подкрепи ежедневната си хидратация.",
  },
  {
    q: "Съдържа ли Hydra+ захар?",
    a: "Не. Hydra+ не съдържа добавена захар.",
  },
  {
    q: "Мога ли да използвам Hydra+ по време на пътуване?",
    a: "Абсолютно. Пътуването, полетите и топлият климат могат да увеличат загубата на течности и електролити, което прави хидратацията още по-важна.",
  },
  {
    q: "Подходящ ли е Hydra+ за кето или нисковъглехидратен режим?",
    a: "Да. Hydra+ не съдържа добавена захар и се вписва добре в нисковъглехидратен начин на живот.",
  },
];
