import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";

type Props = {
  type: "success" | "error" | null;
  message: string;
  onClose: () => void;
};

export function ToastModal({ type, message, onClose }: Props) {
  return (
    <AnimatePresence>
      {type && (
        <motion.div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-6 backdrop-blur" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div initial={{ scale: 0.86, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 12 }} className="glass mobile-frame rounded-[30px] p-6 text-center">
            <div className={`mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full ${type === "success" ? "bg-cyan/15 text-cyan" : "bg-pink/15 text-pink"}`}>
              {type === "success" ? <CheckCircle2 size={34} /> : <XCircle size={34} />}
            </div>
            <h3 className="text-xl font-black">{type === "success" ? "Order Placed" : "Action Needed"}</h3>
            <p className="mt-2 text-sm leading-6 text-white/64">{message}</p>
            <button onClick={onClose} className="mt-5 h-13 w-full rounded-2xl bg-white text-sm font-black text-night">Done</button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
