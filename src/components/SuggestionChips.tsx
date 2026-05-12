import { motion } from "framer-motion";
import { Sparkles, Stars, BookOpen, Sun } from "lucide-react";

const SUGGESTIONS = [
  { label: "Tell me about Ravana", icon: Sparkles },
  { label: "Generate Horoscope", icon: Stars },
  { label: "Explain Ramayan", icon: BookOpen },
  { label: "Today's Prediction", icon: Sun },
];

export function SuggestionChips({ onPick, disabled }: { onPick: (q: string) => void; disabled?: boolean }) {
  return (
    <div className="max-w-3xl mx-auto px-4 pb-2 flex flex-wrap gap-2 justify-center">
      {SUGGESTIONS.map((s, i) => {
        const Icon = s.icon;
        return (
          <motion.button
            key={s.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            disabled={disabled}
            onClick={() => onPick(s.label)}
            className="group flex items-center gap-1.5 px-3.5 py-1.5 rounded-full glass border border-primary/15 hover:border-primary/40 text-xs text-foreground/85 hover:text-primary transition-all hover:shadow-[0_0_18px_var(--cyan-glow)] disabled:opacity-50"
          >
            <Icon size={12} className="text-primary group-hover:text-primary" />
            {s.label}
          </motion.button>
        );
      })}
    </div>
  );
}
