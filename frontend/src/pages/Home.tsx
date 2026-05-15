import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Headphones, LogOut, Sparkles, Star, UserRoundCheck, Zap } from "lucide-react";
import { Background } from "../components/Background";
import { Button } from "../components/Button";
import { ServiceModals } from "../components/ServiceModals";
import { StatCard } from "../components/StatCard";
import { api } from "../services/api";
import { useAuthStore } from "../context/authStore";
import { useProfile } from "../hooks/useProfile";

export default function Home() {
  const { auth, logout } = useAuthStore();
  const { profile, loading } = useProfile(auth.tiktokUrl);
  const [menuOpen, setMenuOpen] = useState(false);
  const [freeOpen, setFreeOpen] = useState(false);
  const [premiumOpen, setPremiumOpen] = useState(false);

  async function support() {
    const res = await api.support();
    window.location.href = res.data?.url || import.meta.env.VITE_DISCORD_SUPPORT_URL || "https://discord.gg/your-server";
  }

  return (
    <main className="app-shell relative">
      <Background />
      <section className="mobile-frame relative pb-6">
        <header className="mb-6 flex items-center justify-between pt-1">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan/80">Creator Console</p>
            <h1 className="mt-1 text-3xl font-black">Kaddu Boost</h1>
          </div>
          <div className="relative">
            <button onClick={() => setMenuOpen((v) => !v)} className="neon-border h-14 w-14 overflow-hidden rounded-2xl bg-white/10">
              {profile?.avatar ? <img src={profile.avatar} alt="TikTok avatar" className="h-full w-full object-cover" /> : <div className="h-full w-full animate-shimmer shimmer" />}
            </button>
            <AnimatePresence>
              {menuOpen && (
                <motion.div initial={{ opacity: 0, y: 10, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.96 }} className="glass absolute right-0 top-16 z-20 w-44 rounded-3xl p-2">
                  <button onClick={support} className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-bold text-white/82"><Headphones size={17} /> Support</button>
                  <button onClick={logout} className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-bold text-pink"><LogOut size={17} /> Logout</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </header>

        <section className="glass neon-border rounded-[36px] p-5">
          {loading ? (
            <div className="space-y-4">
              <div className="h-20 rounded-3xl shimmer animate-shimmer" />
              <div className="grid grid-cols-2 gap-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-24 rounded-3xl shimmer animate-shimmer" />)}</div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-4">
                <div className="grid h-16 w-16 place-items-center overflow-hidden rounded-3xl bg-white/10">
                  <img src={profile?.avatar} alt="" className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="truncate text-2xl font-black">@{profile?.username}</h2>
                    {profile?.verified && <UserRoundCheck className="text-cyan" size={20} />}
                  </div>
                  <p className="text-sm text-white/52">{profile?.verified ? "Verified TikTok profile" : "TikTok profile connected"}</p>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <StatCard label="Followers" value={profile?.followers || 0} />
                <StatCard label="Following" value={profile?.following || 0} />
                <StatCard label="Likes" value={profile?.likes || 0} />
                <StatCard label="Videos" value={profile?.videos || 0} />
              </div>
            </>
          )}
        </section>

        <section className="mt-5 grid gap-4">
          <motion.div whileTap={{ scale: 0.98 }} className="rounded-[30px] bg-gradient-to-br from-cyan/24 via-white/10 to-violet/20 p-[1px] shadow-glow">
            <button onClick={() => setFreeOpen(true)} className="flex w-full items-center gap-4 rounded-[29px] bg-panel/88 p-5 text-left backdrop-blur">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-cyan/12 text-cyan"><Zap /></span>
              <span><span className="block text-xl font-black">Free Services</span><span className="mt-1 block text-sm text-white/50">100 amount, hourly cooldown</span></span>
            </button>
          </motion.div>
          <motion.div whileTap={{ scale: 0.98 }} className="rounded-[30px] bg-gradient-to-br from-pink/26 via-white/10 to-lime/16 p-[1px] shadow-pinkGlow">
            <button onClick={() => setPremiumOpen(true)} className="flex w-full items-center gap-4 rounded-[29px] bg-panel/88 p-5 text-left backdrop-blur">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-pink/12 text-pink"><Star /></span>
              <span><span className="block text-xl font-black">Premium Services</span><span className="mt-1 block text-sm text-white/50">Single-use keys, faster queue</span></span>
            </button>
          </motion.div>
        </section>

        <section className="mt-5 rounded-[30px] border border-white/10 bg-white/[0.05] p-5 backdrop-blur">
          <div className="mb-4 flex items-center gap-3">
            <Sparkles className="text-lime" />
            <h3 className="text-lg font-black">Live safeguards</h3>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs font-semibold text-white/62">
            <div className="rounded-2xl bg-white/[0.06] p-3">IP + device checks</div>
            <div className="rounded-2xl bg-white/[0.06] p-3">IST daily reset</div>
            <div className="rounded-2xl bg-white/[0.06] p-3">Webhook logging</div>
            <div className="rounded-2xl bg-white/[0.06] p-3">Key hash storage</div>
          </div>
        </section>
      </section>

      <ServiceModals auth={auth} freeOpen={freeOpen} premiumOpen={premiumOpen} closeFree={() => setFreeOpen(false)} closePremium={() => setPremiumOpen(false)} />
    </main>
  );
}
