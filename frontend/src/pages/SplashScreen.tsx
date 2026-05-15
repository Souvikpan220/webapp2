import { motion } from "framer-motion";

export function SplashScreen() {
  return (
    <main className="relative grid h-[100svh] place-items-center overflow-hidden bg-night px-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(39,245,255,.24),transparent_16rem),radial-gradient(circle_at_50%_72%,rgba(255,62,219,.18),transparent_18rem)]" />
      {Array.from({ length: 18 }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute h-1 w-1 rounded-full bg-white/70"
          initial={{ x: Math.random() * 360 - 180, y: Math.random() * 640 - 320, opacity: 0 }}
          animate={{ y: [null, Math.random() * -240], opacity: [0, 1, 0] }}
          transition={{ duration: 1.8, delay: i * 0.04, repeat: Infinity }}
        />
      ))}
      <motion.div initial={{ scale: 0.72, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 1.08, opacity: 0 }} transition={{ duration: 0.65 }} className="relative text-center">
        <motion.div animate={{ rotate: [0, 4, -4, 0] }} transition={{ duration: 1.2, repeat: Infinity }} className="neon-border mx-auto grid h-28 w-28 place-items-center rounded-[34px] bg-white/10 shadow-glow backdrop-blur-2xl">
          <span className="animate-pulseGlow bg-gradient-to-br from-cyan via-white to-pink bg-clip-text text-5xl font-black text-transparent">K</span>
        </motion.div>
        <motion.h1 initial={{ y: 18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.35 }} className="mt-6 text-3xl font-black tracking-tight">
          Kaddu Boost
        </motion.h1>
        <p className="mt-2 text-sm font-medium text-white/54">Premium creator services</p>
      </motion.div>
    </main>
  );
}
