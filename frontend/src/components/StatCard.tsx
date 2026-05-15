import { useCounter } from "../hooks/useCounter";

export function StatCard({ label, value }: { label: string; value: number | string }) {
  const numeric = typeof value === "number";
  const count = useCounter(numeric ? value : 0);
  const display = numeric ? Intl.NumberFormat("en", { notation: count > 9999 ? "compact" : "standard" }).format(count) : value;

  return (
    <div className="glass rounded-3xl p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/40">{label}</p>
      <p className="mt-2 text-2xl font-black">{display}</p>
    </div>
  );
}
