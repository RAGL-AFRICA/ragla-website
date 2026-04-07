import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Minimize2, Bot, User, ChevronRight, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";

// No knowledge base here anymore! It's securely hosted in the Supabase Edge Function.
import { supabase } from "@/lib/supabase";
import { generateId } from "@/lib/utils";

const QUICK_SUGGESTIONS = [
  "What is RAGLA?",
  "Membership categories",
  "How do I apply?",
  "Membership benefits",
  "Contact RAGLA",
];

// ──────────────────────────────────────────────
// TYPES
// ──────────────────────────────────────────────

interface Message {
  id: string;
  role: "user" | "bot";
  text: string;
  links?: { label: string; href: string }[];
  suggestions?: string[];
  ts: Date;
}

// ──────────────────────────────────────────────
// MARKDOWN-ish renderer (bold + newlines only)
// ──────────────────────────────────────────────

function renderText(text: string) {
  const lines = text.split("\n");
  return lines.map((line, i) => {
    // Bold: **text**
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    const rendered = parts.map((part, j) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={j}>{part.slice(2, -2)}</strong>;
      }
      return <span key={j}>{part}</span>;
    });
    return (
      <span key={i}>
        {rendered}
        {i < lines.length - 1 && <br />}
      </span>
    );
  });
}

// ──────────────────────────────────────────────
// CHATBOT COMPONENT
// ──────────────────────────────────────────────

const RAGLAChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "bot",
      text: "Hello! 👋 I'm your RAGLA assistant. I can answer questions about our Academy, membership categories, application process, benefits, and more.\n\nHow can I help you today?",
      suggestions: QUICK_SUGGESTIONS,
      ts: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isMinimized]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, isMinimized]);

  const handleOpen = () => {
    setIsOpen(true);
    setIsMinimized(false);
    setHasUnread(false);
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: generateId(),
      role: "user",
      text: text.trim(),
      ts: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const { data, error } = await supabase.functions.invoke("chat-with-gemini", {
        body: { message: text }
      });

      if (error) throw error;

      const botMsg: Message = {
        id: generateId(),
        role: "bot",
        text: data?.text || "I'm sorry, I couldn't process that right now.",
        ts: new Date(),
      };
      
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMsg: Message = {
        id: generateId(),
        role: "bot",
        text: "I'm sorry, I'm having trouble connecting to my brain right now. Please try again later!",
        ts: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = () => sendMessage(input);



  const handleReset = () => {
    setMessages([
      {
        id: "welcome",
        role: "bot",
        text: "Conversation reset. 👋 How can I help you?",
        suggestions: QUICK_SUGGESTIONS,
        ts: new Date(),
      },
    ]);
  };

  return (
    <>
      {/* ── Backdrop (Click outside to close) ─────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40 bg-black/5 sm:bg-transparent backdrop-blur-[2px] sm:backdrop-blur-none"
          />
        )}
      </AnimatePresence>

      {/* ── Floating Bubble ─────────────────────── */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            key="bubble"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            onClick={handleOpen}
            aria-label="Open chat assistant"
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary text-primary-foreground shadow-2xl shadow-primary/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform duration-200 group"
          >
            <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7" />
            {hasUnread && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-background animate-bounce" />
            )}
            {/* Tooltip — desktop only */}
            <span className="hidden sm:block absolute right-full mr-3 bg-background border border-border text-foreground text-xs font-semibold px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Ask RAGLA Assistant
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Chat Panel ──────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="panel"
            // Mobile: slide up from bottom. Desktop: scale in from bottom-right.
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className={[
              "fixed z-50 flex flex-col overflow-hidden",
              "bg-background/85 backdrop-blur-2xl border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.2)]",
              // Mobile: full-width bottom sheet anchored to screen bottom
              "inset-x-0 bottom-0 rounded-t-[2.5rem] border-t",
              // sm+: floating panel bottom-right, capped width
              "sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[440px] sm:rounded-[2rem] sm:border",
              // height: tall on mobile (no max needed, flex manages it), capped on desktop
              isMinimized ? "h-auto" : "max-h-[85svh] sm:max-h-[min(720px,90vh)]",
            ].join(" ")}
          >
            {/* ── Header ───────────────────────────── */}
            <div className="flex items-center gap-3 px-5 sm:px-6 py-4 sm:py-5 bg-gradient-to-r from-primary via-primary/95 to-primary/90 text-primary-foreground flex-shrink-0 relative overflow-hidden">
              {/* Subtle light effect in header */}
              <div className="absolute inset-0 bg-white/5 pointer-events-none" />
              
              {/* Mobile drag handle */}
              <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-12 h-1.5 rounded-full bg-primary-foreground/20 sm:hidden" />

              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm leading-tight">RAGLA Assistant</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <p className="text-xs text-primary-foreground/80">Online · Ready to help</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0 relative z-10">
                <button
                  onClick={handleReset}
                  title="Reset conversation"
                  className="w-9 h-9 rounded-xl hover:bg-primary-foreground/20 flex items-center justify-center transition-all hover:scale-105 active:scale-90"
                >
                  <RotateCcw className="w-4.5 h-4.5" />
                </button>
                {/* Minimize — desktop only */}
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  title={isMinimized ? "Expand" : "Minimize"}
                  className="hidden sm:flex w-9 h-9 rounded-xl hover:bg-primary-foreground/20 items-center justify-center transition-all hover:scale-105 active:scale-90"
                >
                  <Minimize2 className="w-4.5 h-4.5" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title="Close Assistant"
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-red-500/80 flex items-center justify-center transition-all hover:scale-105 active:scale-90 text-primary-foreground group"
                >
                  <X className="w-4.5 h-4.5 group-hover:rotate-90 transition-transform duration-300" />
                </button>
              </div>
            </div>

            <AnimatePresence>
              {!isMinimized && (
                <motion.div
                  key="body"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: "easeInOut" }}
                  className="flex flex-col flex-1 overflow-hidden min-h-0"
                >
                  {/* ── Messages ───────────────────────── */}
                  <div
                    className="flex-1 overflow-y-auto overscroll-contain px-3 sm:px-4 py-4 sm:py-5 space-y-4 scroll-smooth"
                    style={{ minHeight: 0 }}
                  >
                    {messages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.22 }}
                        className={`flex gap-2 sm:gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                      >
                        {/* Avatar */}
                        <div
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${
                            msg.role === "bot"
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-foreground border border-border"
                          }`}
                        >
                          {msg.role === "bot" ? <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                        </div>

                        <div className={`flex flex-col gap-1.5 sm:gap-2 max-w-[82%] ${msg.role === "user" ? "items-end" : "items-start"}`}>
                          {/* Bubble */}
                          <div
                            className={`px-4 sm:px-5 py-3 sm:py-3.5 rounded-2xl text-[0.925rem] leading-relaxed shadow-sm ${
                              msg.role === "user"
                                ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground rounded-tr-sm border border-primary/20"
                                : "bg-card/40 backdrop-blur-sm text-foreground rounded-tl-sm border border-border/50"
                            }`}
                          >
                            {renderText(msg.text)}
                          </div>

                          {/* Links */}
                          {msg.links && msg.links.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 sm:gap-2">
                              {msg.links.map((link) => (
                                <Link
                                  key={link.href}
                                  to={link.href}
                                  onClick={() => setIsOpen(false)}
                                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline border border-primary/30 bg-primary/5 hover:bg-primary/10 px-2.5 sm:px-3 py-1.5 rounded-full transition-colors"
                                >
                                  {link.label} <ChevronRight className="w-3 h-3" />
                                </Link>
                              ))}
                            </div>
                          )}

                              {/* Suggestion chips */}
                              {msg.suggestions && msg.suggestions.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {msg.suggestions.map((s) => (
                                    <button
                                      key={s}
                                      onClick={() => sendMessage(s)}
                                      className="text-[0.75rem] font-medium text-primary hover:text-primary-foreground border border-primary/30 hover:border-primary bg-primary/5 hover:bg-primary px-3 py-1.5 rounded-full transition-all duration-300"
                                    >
                                      {s}
                                    </button>
                                  ))}
                                </div>
                              )}
                        </div>
                      </motion.div>
                    ))}

                    {/* Typing Indicator */}
                    <AnimatePresence>
                      {isTyping && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="flex gap-2 sm:gap-2.5 items-end"
                        >
                          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex-shrink-0 flex items-center justify-center bg-primary text-primary-foreground">
                            <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </div>
                          <div className="bg-card/40 backdrop-blur-sm border border-border/50 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1.5 items-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary/80 animate-pulse" style={{ animationDelay: "0ms" }} />
                            <span className="w-1.5 h-1.5 rounded-full bg-primary/80 animate-pulse" style={{ animationDelay: "200ms" }} />
                            <span className="w-1.5 h-1.5 rounded-full bg-primary/80 animate-pulse" style={{ animationDelay: "400ms" }} />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <div ref={messagesEndRef} />
                  </div>

                  {/* ── Quick Chips ─────────────────────── */}
                  <div className="px-3 sm:px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-none flex-nowrap border-t border-border/40 pt-2">
                    {QUICK_SUGGESTIONS.slice(0, 4).map((s) => (
                      <button
                        key={s}
                        onClick={() => sendMessage(s)}
                        className="flex-shrink-0 text-xs text-muted-foreground border border-border bg-secondary/50 hover:border-primary hover:text-primary hover:bg-primary/5 px-3 py-1.5 rounded-full transition-all whitespace-nowrap"
                      >
                        {s}
                      </button>
                    ))}
                  </div>

                  {/* ── Input Bar ────────────────────────── */}
                  {/* pb-safe accounts for iOS home indicator */}
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSend();
                    }}
                    className="flex items-center gap-2 px-3 sm:px-4 py-3 sm:py-4 border-t border-border bg-background/90 backdrop-blur-sm flex-shrink-0 pb-[env(safe-area-inset-bottom,12px)] sm:pb-3"
                  >
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask me anything about RAGLA..."
                      className="flex-1 bg-secondary/60 border border-border rounded-xl px-3 sm:px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                      disabled={isTyping}
                    />
                    <button
                      type="submit"
                      disabled={!input.trim() || isTyping}
                      className="w-11 h-11 sm:w-10 sm:h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:brightness-110 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0 shadow-lg shadow-primary/20"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default RAGLAChatbot;

