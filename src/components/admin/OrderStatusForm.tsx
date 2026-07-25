"use client";

import { useActionState } from "react";
import { updateOrderStatusAction, type AdminState } from "@/lib/actions/admin";
import { statusMeta, type OrderStatus } from "@/lib/orders";

const initialState: AdminState = {};

export function OrderStatusForm({
  orderId,
  status,
  carrier,
  trackingNo,
}: {
  orderId: string;
  status: string;
  carrier: string;
  trackingNo: string;
}) {
  const [state, formAction, pending] = useActionState(
    updateOrderStatusAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="orderId" value={orderId} />

      {state.ok && (
        <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          Поръчката е обновена.
        </p>
      )}
      {state.error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
          {state.error}
        </p>
      )}

      <div>
        <label
          htmlFor="status"
          className="block text-sm font-medium text-brand-navy-500"
        >
          Статус
        </label>
        <select
          id="status"
          name="status"
          defaultValue={status}
          className="mt-1.5 w-full rounded-xl border border-brand-navy-500/15 bg-white px-4 py-2.5 text-brand-navy-500 outline-none transition-colors focus:border-brand-navy-500"
        >
          {(Object.keys(statusMeta) as OrderStatus[]).map((key) => (
            <option key={key} value={key}>
              {statusMeta[key].label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="carrier"
            className="block text-sm font-medium text-brand-navy-500"
          >
            Куриер
          </label>
          <input
            id="carrier"
            name="carrier"
            defaultValue={carrier}
            placeholder="Еконт / Спиди"
            className="mt-1.5 w-full rounded-xl border border-brand-navy-500/15 bg-white px-4 py-2.5 text-brand-navy-500 outline-none transition-colors placeholder:text-brand-navy-500/35 focus:border-brand-navy-500"
          />
        </div>
        <div>
          <label
            htmlFor="trackingNo"
            className="block text-sm font-medium text-brand-navy-500"
          >
            Товарителница №
          </label>
          <input
            id="trackingNo"
            name="trackingNo"
            defaultValue={trackingNo}
            placeholder="1053 7788 9900"
            className="mt-1.5 w-full rounded-xl border border-brand-navy-500/15 bg-white px-4 py-2.5 text-brand-navy-500 outline-none transition-colors placeholder:text-brand-navy-500/35 focus:border-brand-navy-500"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-brand-navy-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-navy-700 disabled:opacity-60"
      >
        {pending ? "Запазване…" : "Запази промените"}
      </button>
    </form>
  );
}
