import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2 } from "lucide-react";
import { AstrologyPanel } from "./AstrologyPanel";

interface AppSidebarProps {
  open: boolean;
  onClose: () => void;
  onClearChat: () => void;
}

export function AppSidebar({ open, onClose, onClearChat }: AppSidebarProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/50 backdrop-blur-sm z-40 lg:hidden"
          />
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 bottom-0 w-[300px] glass-strong z-50 flex flex-col border-r border-border/30"
          >
            <div className="flex items-center justify-between p-4 border-b border-border/30">
              <h2 className="font-display text-sm font-semibold text-gradient-royal">Raavan AI</h2>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { onClearChat(); onClose(); }}
                className="w-full flex items-center gap-2 py-2.5 px-3 rounded-xl bg-destructive/10 hover:bg-destructive/20 text-destructive text-sm transition-colors border border-destructive/20"
              >
                <Trash2 size={14} />
                Clear Chat
              </motion.button>

              <div className="h-px bg-border/30" />

              <AstrologyPanel />
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
