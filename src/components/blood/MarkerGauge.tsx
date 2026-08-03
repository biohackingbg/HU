type Status = "low" | "optimal" | "high";

const statusMeta: Record<Status, { label: string; dot: string; text: string }> = {
  low: { label: "Ниско", dot: "bg-amber-400", text: "text-amber-600" },
  optimal: { label: "Оптимално", dot: "bg-emerald-500", text: "text-emerald-600" },
  high: { label: "Високо", dot: "bg-amber-400", text: "text-amber-600" },
};

export function MarkerGauge({
  name,
  value,
  unit,
  min,
  max,
  optimalFrom,
  optimalTo,
  status,
}: {
  name: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  optimalFrom: number;
  optimalTo: number;
  status: Status;
}) {
  const pct = (v: number) => ((v - min) / (max - min)) * 100;
  const meta = statusMeta[status];

  return (
    <div className="rounded-2xl border border-brand-navy-500/10 bg-white p-5">
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-medium text-brand-navy-500">{name}</span>
        <span className="text-sm text-brand-navy-500/50">{unit}</span>
      </div>

      <div className="mt-1 flex items-baseline gap-2">
        <span className="font-display text-2xl font-extrabold text-brand-navy-500">
          {value}
        </span>
        <span className={`flex items-center gap-1.5 text-sm font-medium ${meta.text}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
          {meta.label}
        </span>
      </div>

      {/* Scale */}
      <div className="relative mt-4 h-2 rounded-full bg-brand-navy-500/8">
        {/* optimal band */}
        <div
          className="absolute inset-y-0 rounded-full bg-emerald-500/25"
          style={{
            left: `${pct(optimalFrom)}%`,
            width: `${pct(optimalTo) - pct(optimalFrom)}%`,
          }}
        />
        {/* marker */}
        <div
          className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-white bg-brand-navy-500 shadow"
          style={{ left: `${Math.min(100, Math.max(0, pct(value)))}%` }}
        />
      </div>
      <div className="mt-2 flex justify-between text-[11px] text-brand-navy-500/40">
        <span>{min}</span>
        <span>оптимален диапазон</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
