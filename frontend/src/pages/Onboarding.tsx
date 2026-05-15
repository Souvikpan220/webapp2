import { useState } from "react";
import { AtSign, Music2 } from "lucide-react";
import { Background } from "../components/Background";
import { Button } from "../components/Button";
import { TextInput } from "../components/TextInput";
import { api } from "../services/api";
import { useAuthStore } from "../context/authStore";
import { tiktokProfileRegex } from "../utils/validators";

export default function Onboarding() {
  const { auth, completeOnboarding } = useAuthStore();
  const [discordUsername, setDiscordUsername] = useState(auth.discordUsername || "");
  const [tiktokUrl, setTiktokUrl] = useState(auth.tiktokUrl || "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!tiktokProfileRegex.test(tiktokUrl)) return setError("Use a valid profile URL like https://www.tiktok.com/@username");
    setLoading(true);
    const res = await api.completeOnboarding({ email: auth.email, discordUsername, tiktokUrl, deviceId: auth.deviceId });
    setLoading(false);
    if (!res.ok) return setError(res.message || "Could not save profile. Please try again.");
    completeOnboarding({ discordUsername, tiktokUrl });
  }

  return (
    <main className="app-shell relative">
      <Background />
      <section className="mobile-frame relative flex min-h-[calc(100svh-40px)] flex-col justify-center">
        <div className="mb-8">
          <div className="flex gap-3">
            <div className="grid h-14 w-14 place-items-center rounded-3xl bg-pink/12 text-pink shadow-pinkGlow"><AtSign /></div>
            <div className="grid h-14 w-14 place-items-center rounded-3xl bg-cyan/12 text-cyan shadow-glow"><Music2 /></div>
          </div>
          <h1 className="mt-6 text-4xl font-black leading-tight">Connect your creator profile</h1>
          <p className="mt-3 max-w-sm text-sm leading-6 text-white/56">We keep the session on this device so the app opens straight to Home next time.</p>
        </div>
        <div className="glass neon-border rounded-[34px] p-5">
          <div className="space-y-5">
            <TextInput label="Discord username optional" value={discordUsername} onChange={(e) => setDiscordUsername(e.target.value)} placeholder="name#0000 or @name" />
            <TextInput label="TikTok profile URL" value={tiktokUrl} error={error} onChange={(e) => { setError(""); setTiktokUrl(e.target.value); }} placeholder="https://www.tiktok.com/@username" />
            <Button onClick={submit} loading={loading} className="w-full">Continue</Button>
          </div>
        </div>
      </section>
    </main>
  );
}
