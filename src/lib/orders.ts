import { formatBgn, formatEur } from "@/lib/product";

export function formatCentsEur(cents: number) {
  return formatEur(cents / 100);
}

export function formatCentsBgn(cents: number) {
  return formatBgn(cents / 100);
}

export type OrderStatus =
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export const statusMeta: Record<
  OrderStatus,
  { label: string; className: string }
> = {
  processing: {
    label: "Обработва се",
    className: "bg-amber-50 text-amber-700",
  },
  shipped: {
    label: "Изпратена",
    className: "bg-brand-sky-100 text-brand-sky-700",
  },
  delivered: {
    label: "Доставена",
    className: "bg-emerald-50 text-emerald-700",
  },
  cancelled: {
    label: "Отказана",
    className: "bg-red-50 text-red-600",
  },
};

export function statusInfo(status: string) {
  return statusMeta[status as OrderStatus] ?? statusMeta.processing;
}

export function formatOrderDate(date: Date) {
  return new Intl.DateTimeFormat("bg-BG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}
