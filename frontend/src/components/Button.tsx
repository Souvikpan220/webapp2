import { motion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

type Props = HTMLMotionProps<"button"> & {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  loading?: boolean;
};

export function Button({ children, variant = "primary", loading, className = "", disabled, ...props }: Props) {
  const styles = {
    primary: "bg-gradient-to-r from-cyan via-violet to-pink text-white shadow-glow",
    secondary: "border border-white/12 bg-white/10 text-white shadow-lift",
    ghost: "border border-white/10 bg-white/[0.04] text-white/80"
  }[variant];

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      disabled={disabled || loading}
      className={`relative min-h-14 overflow-hidden rounded-2xl px-5 py-4 text-sm font-bold tracking-wide transition disabled:cursor-not-allowed disabled:opacity-55 ${styles} ${className}`}
      {...props}
    >
      {loading && <span className="absolute inset-0 animate-shimmer shimmer opacity-40" />}
      <span className="relative">{loading ? "Processing..." : children}</span>
    </motion.button>
  );
}
