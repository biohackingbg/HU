export type BodySystem = {
  slug: string;
  /** English system name, used in navigation and the line-up. */
  label: string;
  /** Product that covers this system, once one exists. */
  productName?: string;
  /** Short Bulgarian description of what the system covers. */
  note: string;
  status: "live" | "soon";
  href?: string;
};

export const systems: BodySystem[] = [
  {
    slug: "nervous",
    label: "Nervous System",
    productName: "Neuromag 6™",
    note: "Нервна система, когниция и възстановяване",
    status: "live",
    href: "/produkt/neuromag-6",
  },
  {
    slug: "hydration",
    label: "Hydration System",
    productName: "Hydra+",
    note: "Ежедневна хидратация и електролитен баланс",
    status: "live",
    href: "/produkt/hydra-plus",
  },
  {
    slug: "metabolic",
    label: "Metabolic System",
    note: "Метаболизъм и енергиен обмен",
    status: "soon",
  },
  {
    slug: "gut",
    label: "Gut System",
    note: "Храносмилане и микробиом",
    status: "soon",
  },
  {
    slug: "energy",
    label: "Energy System",
    note: "Клетъчна енергия и издръжливост",
    status: "soon",
  },
  {
    slug: "sleep",
    label: "Sleep System",
    note: "Сън и възстановяване",
    status: "soon",
  },
];
