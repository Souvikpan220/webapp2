import type { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export function TextInput({ label, error, className = "", ...props }: Props) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-white/50">{label}</span>
      <input
        className={`h-14 w-full rounded-2xl border border-white/10 bg-black/25 px-4 text-[16px] text-white outline-none transition placeholder:text-white/30 focus:border-cyan/80 focus:shadow-[0_0_0_4px_rgba(39,245,255,.08)] ${className}`}
        {...props}
      />
      {error && <span className="mt-2 block text-xs font-semibold text-pink">{error}</span>}
    </label>
  );
}
