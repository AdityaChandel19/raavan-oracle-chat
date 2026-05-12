import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Menu, Sparkles } from "lucide-react";
import { ChatMessage, TypingIndicator, type Message } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { AppSidebar } from "./AppSidebar";
import { ParticlesBackground } from "./ParticlesBackground";
import { SuggestionChips } from "./SuggestionChips";
import { sendChatMessage } from "../lib/api";
import goldenLanka from "../assets/golden-lanka.png";

const WELCOME_MESSAGE: Message = {
  id: "welcome",
  role: "bot",
  content: "🙏 Namaste! I am **Raavan AI** — your guide through wisdom, knowledge, and the cosmos. Ask me anything, or explore the astrology calculator in the sidebar.",
  timestamp: new Date(),
};

export function RaavanChat() {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }, 50);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  const handleSend = async (content: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const response = await sendChatMessage(content);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "bot",
          content: "The cosmic gateway is temporarily unavailable. Please ensure the backend is awakened and try again.",
          timestamp: new Date(),
          error: true,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => setMessages([WELCOME_MESSAGE]);
  const showChips = messages.length <= 1 && !isTyping;

  return (
    <div className="h-screen flex flex-col relative overflow-hidden">
      {/* Golden Lanka background */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${goldenLanka})` }}
        aria-hidden
      />
      {/* Stronger dark royal overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse at center, oklch(0.11 0.02 260 / 0.78) 0%, oklch(0.08 0.02 260 / 0.92) 70%, oklch(0.06 0.02 260 / 0.96) 100%)",
        }}
        aria-hidden
      />
      <ParticlesBackground />

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex items-center justify-between px-5 py-4 border-b border-white/5 glass-strong"
      >
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setSidebarOpen(true)}
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <Menu size={20} />
          </motion.button>
          <div className="flex items-center gap-2.5">
            <motion.div
              animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="text-gold drop-shadow-[0_0_8px_var(--gold-glow)]"
            >
              <Sparkles size={22} />
            </motion.div>
            <div>
              <h1 className="font-display text-lg font-bold text-gradient-royal tracking-[0.2em] leading-none">
                RAAVAN AI
              </h1>
              <p className="text-[10px] text-muted-foreground/80 tracking-wider mt-0.5 italic">
                Ancient Knowledge. Modern Intelligence.
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-primary/20">
          <span className="relative flex w-2 h-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-ping" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary shadow-[0_0_8px_var(--cyan-glow)]" />
          </span>
          <span className="text-[10px] text-foreground/80 tracking-wider uppercase font-medium">Online</span>
        </div>
      </motion.header>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-8 relative z-10 scrollbar-thin"
      >
        <div className="max-w-3xl mx-auto">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          {isTyping && <TypingIndicator />}
        </div>
      </div>

      {/* Chips + Input */}
      <div className="relative z-10">
        {showChips && <SuggestionChips onPick={handleSend} disabled={isTyping} />}
        <ChatInput onSend={handleSend} disabled={isTyping} />
      </div>

      {/* Sidebar */}
      <AppSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onClearChat={clearChat}
      />
    </div>
  );
}
