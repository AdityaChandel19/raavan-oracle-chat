import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Menu, Sparkles } from "lucide-react";
import { ChatMessage, TypingIndicator, type Message } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { AppSidebar } from "./AppSidebar";
import { ParticlesBackground } from "./ParticlesBackground";
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
          content: "⚠️ I couldn't reach the server. Please ensure the backend is running.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => setMessages([WELCOME_MESSAGE]);

  return (
    <div className="h-screen flex flex-col relative overflow-hidden">
      <ParticlesBackground />

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex items-center justify-between px-4 py-3 border-b border-border/30 glass-strong"
      >
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setSidebarOpen(true)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Menu size={20} />
          </motion.button>
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles size={20} className="text-gold" />
            </motion.div>
            <h1 className="font-display text-lg font-bold text-gradient-royal tracking-wide">
              RAAVAN AI
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs text-muted-foreground">Online</span>
        </div>
      </motion.header>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-6 relative z-10 scrollbar-thin"
      >
        <div className="max-w-3xl mx-auto">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          {isTyping && <TypingIndicator />}
        </div>
      </div>

      {/* Input */}
      <div className="relative z-10">
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
