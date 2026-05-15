import { useState } from "react";
import { Mail } from "lucide-react";
import { Background } from "../components/Background";
import { Button } from "../components/Button";
import { TextInput } from "../components/TextInput";
import { api } from "../services/api";
import { useAuthStore } from "../context/authStore";
import { emailRegex } from "../utils/validators";

export default function EmailAuth() {
  const { auth, setEmail } = useAuthStore();
  const [email, setLocalEmail] = useState(auth.email);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!emailRegex.test(email)) return setError("Enter a valid email address.");
    setLoading(true);
    const res = await api.logEmail({ email, deviceId: auth.deviceId });
    setLoading(false);
    if (!res.ok) return setError(res.message || "Could not sign in. Please try again.");
    setEmail(email);
  }

  return (
    <main className="app-shell relative">
      <Background />
      <section className="mobile-frame relative flex min-h-[calc(100svh-40px)] flex-col justify-center">
        <div className="mb-8">
          <div className="mb-5 grid h-16 w-16 place-items-center rounded-3xl bg-cyan/12 text-cyan shadow-glow">
            <Mail />
          </div>
          <h1 className="text-4xl font-black leading-tight">Sign in to your boost panel</h1>
          <p className="mt-3 max-w-xs text-sm leading-6 text-white/56">Use the email you want linked with your service orders.</p>
        </div>
        <div className="glass neon-border rounded-[34px] p-5">
          <div className="space-y-5">
            <TextInput label="Email address" type="email" inputMode="email" value={email} error={error} onChange={(e) => { setError(""); setLocalEmail(e.target.value); }} placeholder="you@example.com" />
            <Button onClick={submit} loading={loading} className="w-full">Sign In</Button>
          </div>
        </div>
      </section>
    </main>
  );
}
