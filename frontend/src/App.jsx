import { Suspense, lazy, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuthStore } from "./context/authStore";
import { SplashScreen } from "./pages/SplashScreen";
import { LoaderShell } from "./components/LoaderShell";

const EmailAuth = lazy(() => import("./pages/EmailAuth"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const Home = lazy(() => import("./pages/Home"));

export default function App() {
  const [splashDone, setSplashDone] = useState(false);
  const { auth } = useAuthStore();

  useEffect(() => {
    const timer = window.setTimeout(() => setSplashDone(true), 2000);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if ("serviceWorker" in navigator && import.meta.env.PROD) {
      navigator.serviceWorker.register("/sw.js").catch(() => undefined);
    }
  }, []);

  const page = !auth.email ? "email" : !auth.tiktokUrl ? "onboarding" : "home";

  return (
    <div className="min-h-[100svh] overflow-hidden bg-night text-white">
      <AnimatePresence mode="wait">
        {!splashDone ? (
          <SplashScreen key="splash" />
        ) : (
          <motion.div key={page} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={{ duration: 0.32 }}>
            <Suspense fallback={<LoaderShell />}>{page === "email" ? <EmailAuth /> : page === "onboarding" ? <Onboarding /> : <Home />}</Suspense>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
