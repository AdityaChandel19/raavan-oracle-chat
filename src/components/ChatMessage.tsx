import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { AlertTriangle } from "lucide-react";
import raavanAvatar from "@/assets/raavan-avatar.png";

export interface Message {
  id: string;
  role: "user" | "bot";
  content: string;
  timestamp: Date;
  error?: boolean;
}

export function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === "user";

  if (message.error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="flex justify-start mb-5"
      >
        <div className="max-w-[80%] glass rounded-2xl border border-destructive/40 px-4 py-3 flex items-start gap-3 shadow-[0_0_24px_oklch(0.58_0.24_27/25%)]">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-destructive shrink-0 mt-0.5"
          >
            <AlertTriangle size={16} />
          </motion.div>
          <div>
            <p className="text-sm text-foreground/90 leading-relaxed">{message.content}</p>
            <p className="text-[10px] mt-1.5 text-destructive/70 font-display tracking-wider uppercase">Cosmic Disturbance</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, x: isUser ? 20 : -20 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-5 group`}
    >
      {!isUser && (
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center mr-3 mt-1 shrink-0 border border-primary/30 shadow-[0_0_18px_var(--cyan-glow)] bg-background/40"
        >
          <img src={raavanAvatar} alt="Raavan" className="w-full h-full object-cover" />
        </motion.div>
      )}
      <motion.div
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
        className={`max-w-[78%] px-5 py-3.5 rounded-2xl transition-shadow ${
          isUser
            ? "bg-gradient-user border border-primary/25 text-foreground shadow-[0_8px_24px_-8px_oklch(0.65_0.18_305/35%)] hover:shadow-[0_12px_32px_-8px_oklch(0.65_0.18_305/45%)]"
            : "glass text-surface-foreground border border-primary/15 hover:border-primary/30 hover:shadow-[0_0_24px_var(--cyan-glow)]"
        }`}
      >
        {isUser ? (
          <p className="text-sm leading-relaxed">{message.content}</p>
        ) : (
          <div className="text-sm leading-relaxed prose prose-invert prose-sm max-w-none prose-p:my-2 prose-strong:text-gold">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        )}
        <p className="text-[10px] mt-2 opacity-40 font-display tracking-wider">
          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </p>
      </motion.div>
      {isUser && (
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent/30 to-accent/10 flex items-center justify-center ml-3 mt-1 shrink-0 border border-accent/30">
          <span className="text-xs font-bold text-gradient-gold">U</span>
        </div>
      )}
    </motion.div>
  );
}

export function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 mb-5"
    >
      <div className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center shrink-0 border border-primary/30 shadow-[0_0_18px_var(--cyan-glow)] bg-background/40">
        <img src={raavanAvatar} alt="Raavan" className="w-full h-full object-cover" />
      </div>
      <div className="glass px-4 py-3 rounded-2xl flex items-center gap-1.5 border border-primary/15">
        <span className="text-xs text-muted-foreground mr-2 italic">Raavan is contemplating</span>
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-primary"
            animate={{ scale: [0.6, 1.2, 0.6], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>
    </motion.div>
  );
}
