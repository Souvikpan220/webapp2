import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "./Button";
import { Modal } from "./Modal";
import { TextInput } from "./TextInput";
import { ToastModal } from "./ToastModal";
import { api } from "../services/api";
import { tiktokVideoRegex } from "../utils/validators";
import type { AuthState, ServiceType } from "../types";

type Props = {
  auth: AuthState;
  freeOpen: boolean;
  premiumOpen: boolean;
  closeFree: () => void;
  closePremium: () => void;
};

const premiumAmounts: Record<ServiceType, number> = { kaddu1: 1000, kaddu2: 500, kaddu3: 100 };

export function ServiceModals({ auth, freeOpen, premiumOpen, closeFree, closePremium }: Props) {
  const [freeUrl, setFreeUrl] = useState("");
  const [premiumUrl, setPremiumUrl] = useState("");
  const [premiumKey, setPremiumKey] = useState("");
  const [service, setService] = useState<ServiceType>("kaddu1");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error" | null; message: string }>({ type: null, message: "" });
  const amount = useMemo(() => premiumAmounts[service], [service]);

  async function submitFree() {
    if (!tiktokVideoRegex.test(freeUrl)) return setToast({ type: "error", message: "Enter a valid TikTok video URL." });
    setLoading(true);
    const res = await api.submitFree({
  email: auth.email,
  link: freeUrl,
  deviceId: auth.deviceId
});
    setLoading(false);
    if (res.ok) {
      setFreeUrl("");
      closeFree();
      setToast({ type: "success", message: `Free order submitted. Order ID: ${res.data?.orderId}` });
    } else setToast({ type: "error", message: res.message || "Free order failed." });
  }

  async function submitPremium() {
    if (!tiktokVideoRegex.test(premiumUrl)) return setToast({ type: "error", message: "Enter a valid TikTok video URL." });
    if (premiumKey.trim().length < 8) return setToast({ type: "error", message: "Enter a valid premium key." });
    setLoading(true);
    const res = await api.submitPremium({
  email: auth.email,
  service,
  link: premiumUrl,
  premiumKey,
  deviceId: auth.deviceId
});
    setLoading(false);
    if (res.ok) {
      setPremiumUrl("");
      setPremiumKey("");
      closePremium();
      setToast({ type: "success", message: `Premium order placed. Order ID: ${res.data?.orderId}` });
    } else setToast({ type: "error", message: res.message || "Premium order failed." });
  }

  return (
    <>
      <Modal open={freeOpen} title="Free Services" onClose={closeFree}>
        <div className="space-y-4">
          <TextInput label="TikTok video URL" value={freeUrl} onChange={(e) => setFreeUrl(e.target.value)} placeholder="https://www.tiktok.com/@user/video/..." />
          <TextInput label="Amount" value="100" readOnly className="opacity-70" />
          <div className="rounded-2xl border border-cyan/15 bg-cyan/10 p-4 text-xs leading-5 text-cyan/90">1 order per hour, 5 per IST day. Device and IP checks are enforced on the backend.</div>
          <Button loading={loading} onClick={submitFree} className="w-full">Submit Free Order</Button>
        </div>
      </Modal>
      <Modal open={premiumOpen} title="Premium Services" onClose={closePremium}>
        <div className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-white/50">Service</span>
            <div className="relative">
              <select value={service} onChange={(e) => setService(e.target.value as ServiceType)} className="h-14 w-full appearance-none rounded-2xl border border-white/10 bg-black/25 px-4 text-[16px] text-white outline-none focus:border-pink/80">
                <option value="kaddu1">kaddu1</option>
                <option value="kaddu2">kaddu2</option>
                <option value="kaddu3">kaddu3</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-4 text-white/50" size={20} />
            </div>
          </label>
          <TextInput label="Auto amount" value={amount} readOnly className="opacity-70" />
          <TextInput label="TikTok video URL" value={premiumUrl} onChange={(e) => setPremiumUrl(e.target.value)} placeholder="https://www.tiktok.com/@user/video/..." />
          <TextInput label="Premium key" value={premiumKey} onChange={(e) => setPremiumKey(e.target.value)} placeholder="KADDU1-..." />
          <Button loading={loading} onClick={submitPremium} className="w-full">Place Premium Order</Button>
        </div>
      </Modal>
      <ToastModal type={toast.type} message={toast.message} onClose={() => setToast({ type: null, message: "" })} />
    </>
  );
}
