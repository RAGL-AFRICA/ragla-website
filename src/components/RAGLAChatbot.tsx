import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Minimize2, Bot, User, ChevronRight, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";

// ──────────────────────────────────────────────
// RAGLA KNOWLEDGE BASE
// ──────────────────────────────────────────────

interface KBEntry {
  keywords: string[];
  answer: string;
  links?: { label: string; href: string }[];
  suggestions?: string[];
}

const KNOWLEDGE_BASE: KBEntry[] = [
  // ── What is RAGLA ──────────────────────────
  {
    keywords: ["what is ragla", "who is ragla", "about ragla", "tell me about", "what do you do", "ragl", "academy", "governance", "leadership"],
    answer:
      "**RAGLA** (Royal Academy of Governance and Leadership Africa) is a top-notch Pan-African professional Academy dedicated to fostering the highest standards of excellence in governance and leadership across Africa.\n\nWe rally professionals from the public and private sectors, academia, civil society organisations, and the non-profit sector to:\n- Build governance & leadership capacity\n- Reinforce institutions to be more productive and accountable\n- Enhance best ethical practices",
    links: [{ label: "Read More About Us", href: "/about-us" }],
    suggestions: ["What is RAGLA's mission?", "What are RAGLA's values?", "How do I join RAGLA?"],
  },
  // ── Mission ───────────────────────────────
  {
    keywords: ["mission", "purpose", "goal", "thematic", "why ragla"],
    answer:
      "RAGLA's mission is built on **five thematic areas**:\n\n1. **Professional Excellence** — Fostering ethical integrity and accountability in service delivery\n2. **Capacity Building** — Developing leaders through courses, programmes, and CPD initiatives\n3. **Market-Driven Research** — Building a platform to disseminate research and share best practices\n4. **Fostering Strong Partnerships** — Working with governments, CSOs, and the private sector\n5. **Nurturing the Next Generation** — Inspiring Africa's future leaders to champion inclusive and innovative solutions",
    links: [{ label: "About RAGLA", href: "/about-us" }],
    suggestions: ["What are RAGLA's values?", "What are RAGLA's objectives?", "How do I join?"],
  },
  // ── Values ────────────────────────────────
  {
    keywords: ["values", "ipac", "integrity", "professionalism", "accountability", "commitment", "corporate values"],
    answer:
      "RAGLA is driven by **IPAC**:\n\n- 🛡️ **Integrity** — Service with integrity is our clarion call to duty\n- 🏆 **Professionalism** — Adhering to the highest level of standards that define us as a professional body\n- ✅ **Accountability** — Holding fidelity to sincerity, honesty, and good ethical conduct\n- 🎯 **Commitment** — Driven by the highest level of enthusiasm to promote best governance practices",
    suggestions: ["What is RAGLA's mission?", "Tell me about RAGLA's objectives"],
  },
  // ── Objectives ────────────────────────────
  {
    keywords: ["objectives", "goals", "aim", "aims", "what does ragla do"],
    answer:
      "RAGLA's key objectives include:\n\n1. Promote transparency, accountability, integrity, and responsibility\n2. Develop professional standards and codes of conduct\n3. Provide capacity building, certification, and CPD\n4. Conduct and disseminate market-driven research\n5. Advocate policy reform and build partnerships\n6. Facilitate collaborative networking across Africa\n7. Develop youth and emerging leaders\n8. Recognise and accredit excellence in governance\n9. Position Africa as a hub of governance innovation\n10. Promote sustainable and inclusive leadership",
    links: [{ label: "About RAGLA", href: "/about-us" }],
    suggestions: ["How do I join RAGLA?", "What are the membership benefits?"],
  },
  // ── Membership Categories ─────────────────
  {
    keywords: ["membership", "member", "join", "categories", "types", "category", "tier"],
    answer:
      "RAGLA offers **6 membership categories**:\n\n1. **FM-RAGLA** — Foundational Member *(Founders & pioneers)*\n2. **AFF-RAGLA** — Affiliate Member *(Lower–Mid level with degree + 3–5 yrs exp)*\n3. **CertM-RAGLA** — Certified Member *(Degree + completed RAGLA programme + 5 yrs exp)*\n4. **ASSOC-RAGLA** — Associate Member *(Mid–Top management + degree + 5–10 yrs exp)*\n5. **ChM-RAGLA** — Chartered Member *(Postgrad + 10+ yrs leadership + Scholar-Practitioner)*\n6. **F-RAGLA** — Fellow Member *(Highest category — 15–30 yrs experience)*",
    links: [{ label: "View All Categories & Criteria", href: "/membership-benefits" }, { label: "Apply Now", href: "/apply" }],
    suggestions: ["What are the membership benefits?", "How do I apply for membership?", "What is Affiliate membership?"],
  },
  // ── Affiliate Member ──────────────────────
  {
    keywords: ["affiliate", "aff-ragla"],
    answer:
      "**Affiliate Member (AFF-RAGLA)** is suited for lower to mid-level executives.\n\n**Criteria:**\n- At least a Degree or Professional Diploma in a related area\n- 3–5 years of working experience\n- Ready to conform to RAGLA's norms and values\n- Ready to pay appropriate membership dues\n- Willing to undertake CPD as a prerequisite",
    links: [{ label: "Apply Now", href: "/apply" }],
    suggestions: ["Tell me about Associate membership", "What are the membership benefits?"],
  },
  // ── Associate Member ─────────────────────
  {
    keywords: ["associate", "assoc-ragla"],
    answer:
      "**Associate Member (ASSOC-RAGLA)** is for mid-to-top management executives.\n\n**Criteria:**\n- Degree or Professional Qualification in a relevant area\n- Middle-to-Top Management Executive role\n- 5–10 years of working experience in a related field\n- Conform to RAGLA's values and established standards\n- Pay appropriate membership dues and undertake CPD",
    links: [{ label: "Apply Now", href: "/apply" }],
    suggestions: ["Tell me about Chartered membership", "What are the membership benefits?"],
  },
  // ── Certified Member ─────────────────────
  {
    keywords: ["certified", "certm-ragla", "certification"],
    answer:
      "**Certified Member (CertM-RAGLA)**:\n\n**Criteria:**\n- Minimum Bachelor's degree or equivalent professional qualification\n- Completed one of RAGLA's Certified Programmes\n- At least 5 years of relevant professional experience\n- Subscribe to and uphold RAGLA's Code of Ethics\n- Complete a minimum of **40 CPD hours annually**",
    links: [{ label: "Apply Now", href: "/apply" }],
    suggestions: ["Tell me about Chartered membership", "What are CPD requirements?"],
  },
  // ── Chartered Member ─────────────────────
  {
    keywords: ["chartered", "chm-ragla"],
    answer:
      "**Chartered Member (ChM-RAGLA)** is RAGLA's highest professional qualification.\n\n**Criteria:**\n- Recognised Post-Graduate degree or higher\n- Minimum 10 years of progressive leadership or governance experience\n- Proven record of executive leadership or board participation\n- Must be a Scholar-Practitioner with evidence of thought leadership\n- Must have completed RAGLA's Chartered Professional Programme",
    links: [{ label: "Apply Now", href: "/apply" }],
    suggestions: ["Tell me about Fellow membership", "What are the benefits?"],
  },
  // ── Fellow Member ─────────────────────────
  {
    keywords: ["fellow", "f-ragla", "fellows"],
    answer:
      "**Fellow Member (F-RAGLA)** is the **highest RAGLA membership category**. Members are inducted into a Council of Fellows.\n\n**Criteria:**\n- Post-Graduate Qualification (minimum)\n- 15–30 years of unimpeded working experience\n- Accomplished senior corporate executive, seasoned public servant, or renowned academic",
    links: [{ label: "View Membership Categories", href: "/membership-benefits" }],
    suggestions: ["What are the membership benefits?", "How do I apply?"],
  },
  // ── Membership Benefits ───────────────────
  {
    keywords: ["benefit", "benefits", "advantages", "perks", "why join", "what do i get"],
    answer:
      "RAGLA membership comes with **8 key benefit areas**:\n\n🎓 **Professional Recognition** — Designations, certifications, post-nominal letters\n🌍 **Networking** — Pan-African and global network of governance professionals\n📚 **Capacity Building** — Free/discounted CPD programmes & executive training\n📖 **Knowledge Resources** — Journals, newsletters, digital library access\n💼 **Career Advancement** — Mentorship, coaching, leadership development\n🗣️ **Advocacy & Influence** — Shape governance reform across Africa\n💰 **Discounts & Privileges** — Special rates on exams, events, publications\n🤝 **Community Impact** — CSR projects and principled leadership initiatives",
    links: [{ label: "Full Benefits Details", href: "/membership-benefits" }],
    suggestions: ["How do I apply for membership?", "What are the membership categories?"],
  },
  // ── How to Apply ──────────────────────────
  {
    keywords: ["apply", "application", "how to join", "register", "sign up", "enroll", "process", "steps"],
    answer:
      "Applying for RAGLA membership is a **5-step process**:\n\n1. **Identity** — Provide your full name, phone, and email\n2. **Payment** — Complete the registration fee via our secure payment widget\n3. **Professional Details** — Share your career background and experience\n4. **Academic & Membership** — Select your category and list qualifications\n5. **Final Submission** — Upload your passport photo, resume, certificates, referees, and statement of purpose\n\nAfter submission, the RAGLA Council will review and contact you.",
    links: [{ label: "Start Your Application", href: "/apply" }],
    suggestions: ["What documents do I need?", "What are the membership categories?", "What is the registration fee?"],
  },
  // ── Documents needed ─────────────────────
  {
    keywords: ["documents", "document", "upload", "what to bring", "what do i need", "files", "required", "requirements"],
    answer:
      "To complete your RAGLA membership application, you will need to upload:\n\n📸 **Passport Photo** (image file)\n📄 **Summarised Resume / CV** (PDF)\n🎓 **Certificates** (PDF)\n💳 **Proof of Payment** (PDF, JPG, or PNG — max 10MB)\n✍️ **Statement of Purpose** (typed in the form)\n👥 **Two Professional Referees** (name & contact)\n\nAll uploads happen securely on the application form.",
    links: [{ label: "Apply Now", href: "/apply" }],
    suggestions: ["How do I apply?", "What is the registration fee?"],
  },
  // ── Contact ───────────────────────────────
  {
    keywords: ["contact", "reach", "phone", "email", "address", "location", "office", "where", "get in touch", "help"],
    answer:
      "You can reach RAGLA through the following:\n\n📞 **Phone:** +233 (0)256257507\n📧 **Email:** Info@ragl-africa.org\n📍 **Address:** GA – 334 – 8177, 2nd Bissau Street, East Legon, Accra – Ghana\n\nYou can also send us a message directly through our Contact page.",
    links: [{ label: "Send a Message", href: "/contact-us" }],
    suggestions: ["How do I apply?", "Tell me about RAGLA"],
  },
  // ── CPD ───────────────────────────────────
  {
    keywords: ["cpd", "continuous professional development", "training", "courses", "learning"],
    answer:
      "RAGLA is committed to **Continuous Professional Development (CPD)**. As a member you get:\n\n- Free or discounted access to executive training and CPD programmes\n- Privileged access to market-driven research, case studies, and global best practices\n- CPD points to maintain your professional standing\n- Certified members must complete a minimum of **40 CPD hours annually**",
    links: [{ label: "Membership Benefits", href: "/membership-benefits" }],
    suggestions: ["Tell me about membership categories", "What are the membership benefits?"],
  },
  // ── Motto ────────────────────────────────
  {
    keywords: ["motto", "slogan", "servitium", "integritas", "phasellus", "latin"],
    answer:
      "RAGLA operates under a three-word Latin motto:\n\n- ✦ **Servitium** — Service\n- ✦ **Integritas** — Integrity\n- ✦ **Phasellus** — Professionalism\n\nThese three pillars define how RAGLA approaches its work across Africa.",
    suggestions: ["What are RAGLA's values?", "Tell me about RAGLA"],
  },
  // ── Location ─────────────────────────────
  {
    keywords: ["ghana", "accra", "east legon", "africa", "pan-african", "pan african"],
    answer:
      "RAGLA is headquartered in **Accra, Ghana**:\n\n📍 GA – 334 – 8177, 2nd Bissau Street, East Legon, Accra – Ghana\n\nAs a Pan-African Academy, RAGLA serves professionals across the entire African continent.",
    links: [{ label: "Contact Us", href: "/contact-us" }],
    suggestions: ["How do I contact RAGLA?", "How do I join?"],
  },
  // ── Events ───────────────────────────────
  {
    keywords: ["event", "events", "conference", "summit", "webinar", "seminar"],
    answer:
      "RAGLA regularly organises leadership events, governance summits, and networking conferences for members and the public. Check our Events page for the latest upcoming activities.",
    links: [{ label: "View Events", href: "/events" }],
    suggestions: ["How do I join RAGLA?", "What are the membership benefits?"],
  },
  // ── News ─────────────────────────────────
  {
    keywords: ["news", "latest", "update", "announcement", "blog", "post", "article"],
    answer:
      "Stay up to date with the latest news, thought leadership articles, and governance updates from RAGLA on our News page.",
    links: [{ label: "Read the News", href: "/news" }],
    suggestions: ["Tell me about RAGLA", "What events are upcoming?"],
  },
  // ── Gallery ──────────────────────────────
  {
    keywords: ["gallery", "photo", "pictures", "images", "photos"],
    answer:
      "View photos and highlights from RAGLA events, programmes, and activities in our Gallery.",
    links: [{ label: "Visit Gallery", href: "/gallery" }],
    suggestions: ["Tell me about RAGLA", "What events are upcoming?"],
  },
  // ── Greeting ────────────────────────────
  {
    keywords: ["hello", "hi", "hey", "greetings", "good morning", "good afternoon", "good evening", "howdy"],
    answer:
      "Hello there! 👋 Welcome to RAGLA — the Royal Academy of Governance and Leadership Africa.\n\nI'm here to answer your questions about our organisation, membership categories, application process, and more. How can I help you today?",
    suggestions: ["What is RAGLA?", "How do I join RAGLA?", "Contact RAGLA"],
  },
  // ── Thanks ───────────────────────────────
  {
    keywords: ["thank", "thanks", "thank you", "appreciate", "great", "wonderful", "perfect", "awesome"],
    answer:
      "You're very welcome! 😊 It's my pleasure to assist. Is there anything else you'd like to know about RAGLA?",
    suggestions: ["How do I apply?", "What are the membership benefits?", "Contact RAGLA"],
  },
];

const QUICK_SUGGESTIONS = [
  "What is RAGLA?",
  "Membership categories",
  "How do I apply?",
  "Membership benefits",
  "Contact RAGLA",
];

// ──────────────────────────────────────────────
// SEARCH LOGIC
// ──────────────────────────────────────────────

function findAnswer(query: string): KBEntry | null {
  const q = query.toLowerCase().trim();
  // Score each entry by count of keyword hits
  let best: KBEntry | null = null;
  let bestScore = 0;

  for (const entry of KNOWLEDGE_BASE) {
    let score = 0;
    for (const kw of entry.keywords) {
      if (q.includes(kw)) score += kw.split(" ").length; // multi-word keywords score higher
    }
    if (score > bestScore) {
      bestScore = score;
      best = entry;
    }
  }
  return bestScore > 0 ? best : null;
}

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

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      text: text.trim(),
      ts: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate thinking delay
    setTimeout(() => {
      const entry = findAnswer(text);
      const botMsg: Message = {
        id: crypto.randomUUID(),
        role: "bot",
        text: entry
          ? entry.answer
          : "I'm sorry, I don't have a specific answer for that. Please feel free to browse our website or contact us directly — we'd be happy to help!\n\n📧 Info@ragl-africa.org\n📞 +233 (0)256257507",
        links: entry?.links,
        suggestions: entry?.suggestions,
        ts: new Date(),
      };
      setIsTyping(false);
      setMessages((prev) => [...prev, botMsg]);
    }, 900 + Math.random() * 400);
  };

  const handleSend = () => sendMessage(input);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

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
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            className={[
              "fixed z-50 flex flex-col overflow-hidden",
              "bg-background/98 backdrop-blur-xl border-border shadow-2xl shadow-black/30",
              // Mobile: full-width bottom sheet anchored to screen bottom
              "inset-x-0 bottom-0 rounded-t-3xl border-t border-l border-r",
              // sm+: floating panel bottom-right, capped width
              "sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[420px] sm:rounded-3xl sm:border",
              // height: tall on mobile (no max needed, flex manages it), capped on desktop
              isMinimized ? "" : "max-h-[88svh] sm:max-h-[min(680px,90vh)]",
            ].join(" ")}
          >
            {/* ── Header ───────────────────────────── */}
            <div className="flex items-center gap-3 px-4 sm:px-5 py-3 sm:py-4 bg-primary text-primary-foreground flex-shrink-0 rounded-t-3xl">
              {/* Mobile drag handle */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-primary-foreground/30 sm:hidden" />

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
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={handleReset}
                  title="Reset conversation"
                  className="w-8 h-8 rounded-full hover:bg-primary-foreground/20 flex items-center justify-center transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                {/* Minimize — desktop only */}
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  title={isMinimized ? "Expand" : "Minimise"}
                  className="hidden sm:flex w-8 h-8 rounded-full hover:bg-primary-foreground/20 items-center justify-center transition-colors"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title="Close"
                  className="w-8 h-8 rounded-full hover:bg-primary-foreground/20 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
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
                            className={`px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl text-sm leading-relaxed ${
                              msg.role === "user"
                                ? "bg-primary text-primary-foreground rounded-tr-sm"
                                : "bg-secondary text-foreground rounded-tl-sm border border-border/50"
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
                            <div className="flex flex-wrap gap-1.5 mt-0.5">
                              {msg.suggestions.map((s) => (
                                <button
                                  key={s}
                                  onClick={() => sendMessage(s)}
                                  className="text-xs text-muted-foreground border border-border hover:border-primary hover:text-primary bg-background hover:bg-primary/5 px-2.5 sm:px-3 py-1.5 rounded-full transition-all"
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
                          <div className="bg-secondary border border-border/50 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1.5 items-center">
                            <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                            <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                            <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "300ms" }} />
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
                  <div className="flex items-center gap-2 px-3 sm:px-4 py-3 sm:py-4 border-t border-border bg-background/90 backdrop-blur-sm flex-shrink-0 pb-[env(safe-area-inset-bottom,12px)] sm:pb-3">
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Ask me anything about RAGLA..."
                      className="flex-1 bg-secondary/60 border border-border rounded-xl px-3 sm:px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                      disabled={isTyping}
                    />
                    <button
                      onClick={handleSend}
                      disabled={!input.trim() || isTyping}
                      className="w-11 h-11 sm:w-10 sm:h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:brightness-110 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0 shadow-lg shadow-primary/20"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
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

