export type BodySystem = {
  slug: string;
  label: string;
  status: "live" | "soon";
  href?: string;
};

export const systems: BodySystem[] = [
  {
    slug: "nervous",
    label: "Nervous System",
    status: "live",
    href: "/produkt/neuromag-6",
  },
  {
    slug: "hydration",
    label: "Hydration System",
    status: "live",
    href: "/produkt/hydra-plus",
  },
  { slug: "metabolic", label: "Metabolic System", status: "soon" },
  { slug: "gut", label: "Gut System", status: "soon" },
  { slug: "energy", label: "Energy System", status: "soon" },
  { slug: "sleep", label: "Sleep System", status: "soon" },
];
