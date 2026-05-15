import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
};

export function Modal({ open, title, onClose, children }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-40 flex items-end bg-black/62 p-3 backdrop-blur-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div
            initial={{ y: 80, scale: 0.98 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 80, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
            className="mobile-frame glass neon-border max-h-[88svh] overflow-y-auto rounded-[32px] p-5"
          >
            <div className="mb-5 flex items-center justify-between gap-4">
              <h2 className="text-xl font-black">{title}</h2>
              <button onClick={onClose} className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/10" aria-label="Close">
                <X size={18} />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
