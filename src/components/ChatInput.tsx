import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  externalValue?: string;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState("");
  const [focused, setFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 120) + "px";
    }
  }, [input]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-4 pb-5 pt-2"
    >
      <motion.div
        animate={{
          boxShadow: focused
            ? "0 0 0 1px oklch(0.72 0.14 195 / 60%), 0 0 32px var(--cyan-glow), 0 20px 50px -20px oklch(0 0 0 / 70%)"
            : "0 10px 30px -15px oklch(0 0 0 / 60%)",
        }}
        transition={{ duration: 0.25 }}
        className="glass-strong rounded-2xl flex items-end gap-2 p-2.5 max-w-3xl mx-auto border border-white/10"
      >
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Ask Raavan anything..."
          rows={1}
          disabled={disabled}
          className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/70 resize-none outline-none px-3 py-2.5 max-h-[120px] scrollbar-thin"
        />
        <motion.button
          whileHover={{ scale: 1.08, rotate: -8 }}
          whileTap={{ scale: 0.92 }}
          onClick={handleSend}
          disabled={!input.trim() || disabled}
          className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-primary/60 text-primary-foreground flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed shrink-0 shadow-[0_0_20px_var(--cyan-glow)] hover:shadow-[0_0_30px_var(--cyan-glow)]"
        >
          <Send size={17} />
        </motion.button>
      </motion.div>
      <p className="text-center text-[10px] text-muted-foreground/60 mt-2 tracking-wide">
        Raavan AI can be poetic. Verify important details.
      </p>
    </motion.div>
  );
}
