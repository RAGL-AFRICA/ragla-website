import { useState, useRef } from "react";
import { Menu, X, ChevronRight, ChevronDown, GraduationCap, TrendingUp, Briefcase, Globe, BookOpen } from "lucide-react";
import logo from "@/assets/ragla logo.png";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// ─── Programmes dropdown items ────────────────────────────────────────────────
const programmeItems = [
  { label: "Overview", href: "/programmes", tab: null, icon: BookOpen, desc: "Explore all programmes" },
  { label: "Courses", href: "/programmes?tab=courses", tab: "courses", icon: GraduationCap, desc: "Certificate to Chartered" },
  { label: "CPD Programmes", href: "/programmes?tab=cpd", tab: "cpd", icon: TrendingUp, desc: "Maintain your designation" },
  { label: "Executive Education", href: "/programmes?tab=executive", tab: "executive", icon: Briefcase, desc: "For senior leaders" },
  { label: "Online Learning", href: "/programmes?tab=online", tab: "online", icon: Globe, desc: "Learn from anywhere" },
];

// ─── Flat nav links (no dropdown) ────────────────────────────────────────────
const navLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about-us" },
  { label: "Membership", href: "/membership-benefits" },
  // "Programmes" is handled separately with a dropdown
  { label: "Gallery", href: "/gallery" },
  { label: "Events", href: "/events" },
  { label: "News", href: "/news" },
  { label: "Contact Us", href: "/contact-us" },
];

// ─── Desktop Programmes Dropdown ──────────────────────────────────────────────
const ProgrammesDropdown = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isActive = location.pathname.startsWith("/programmes");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  };
  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 120);
  };

  return (
    <li className="relative" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      <Link
        to="/programmes"
        className={`inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold tracking-wide transition-all duration-200 hover:text-primary relative group
          ${isActive ? "text-primary" : "text-foreground/75"}`}
        id="nav-programmes-desktop"
      >
        Programmes
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
        <span
          className={`absolute bottom-0 left-0 w-full h-[2px] bg-primary rounded-full transform origin-left transition-transform duration-300 ${
            isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
          }`}
        />
      </Link>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden z-50"
          >
            <div className="p-2">
              {programmeItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-secondary transition-colors group/item"
                  onClick={() => setOpen(false)}
                >
                  <div className="bg-primary/10 p-2 rounded-lg flex-shrink-0 group-hover/item:bg-primary/20 transition-colors">
                    <item.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-foreground text-sm font-semibold leading-tight">{item.label}</p>
                    <p className="text-muted-foreground text-xs">{item.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="border-t border-border px-4 py-3">
              <Link
                to="/apply"
                className="flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-xl py-2 text-xs font-bold hover:brightness-110 transition-all"
                onClick={() => setOpen(false)}
              >
                Apply to a Programme <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
};

// ─── Header ───────────────────────────────────────────────────────────────────
const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [programmesExpanded, setProgrammesExpanded] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* Unified Sticky Navbar */}
      <header className="fixed top-0 inset-x-0 z-50 bg-background/85 backdrop-blur-xl border-b border-border shadow-lg">
        <div className="container-main flex items-center justify-between px-4 md:px-6 py-3 md:py-4">

          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 md:gap-4 z-50">
            <img src={logo} alt="RAGLA Logo" className="h-12 md:h-16 w-auto drop-shadow-sm" />
            <div className="hidden lg:flex flex-col items-center justify-center">
              <h1 className="text-foreground font-black text-[1.7rem] leading-none uppercase tracking-normal">
                Royal Academy
              </h1>
              <p className="text-primary text-[0.67rem] font-extrabold uppercase tracking-normal mt-0.5 opacity-90">
                Of Governance & Leadership Africa
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center flex-1 justify-center px-4">
            <ul className="flex items-center gap-0.5">
              {/* Home */}
              {navLinks.slice(0, 3).map((link) => {
                const isActive = location.pathname === link.href || (link.href !== "/" && location.pathname.startsWith(link.href));
                return (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className={`px-3 py-2 text-xs font-semibold tracking-wide transition-all duration-200 hover:text-primary relative group
                        ${isActive ? "text-primary" : "text-foreground/75"}`}
                    >
                      {link.label}
                      <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-primary rounded-full transform origin-left transition-transform duration-300 ${isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`} />
                    </Link>
                  </li>
                );
              })}

              {/* Programmes Dropdown */}
              <ProgrammesDropdown />

              {/* Remaining links */}
              {navLinks.slice(3).map((link) => {
                const isActive = location.pathname === link.href || (link.href !== "/" && location.pathname.startsWith(link.href));
                return (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className={`px-3 py-2 text-xs font-semibold tracking-wide transition-all duration-200 hover:text-primary relative group
                        ${isActive ? "text-primary" : "text-foreground/75"}`}
                    >
                      {link.label}
                      <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-primary rounded-full transform origin-left transition-transform duration-300 ${isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`} />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3 flex-shrink-0">
            <Link
              to="/apply"
              className="bg-primary text-primary-foreground px-4 md:px-5 py-2 rounded-full text-xs font-bold shadow-md shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300 whitespace-nowrap"
            >
              Join
            </Link>
          </div>

          {/* Mobile Toggle Button */}
          <button
            className="lg:hidden text-foreground p-2 rounded-full hover:bg-secondary transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Tablet Navigation (md to lg) */}
        <div className="hidden md:flex lg:hidden border-t border-border/50">
          <div className="container-main flex flex-wrap justify-center gap-2 py-3 px-4">
            {navLinks.slice(0, 3).map((link) => {
              const isActive = location.pathname === link.href || (link.href !== "/" && location.pathname.startsWith(link.href));
              return (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`px-3 py-1 text-xs font-semibold rounded-full transition-all ${
                    isActive ? "bg-primary text-primary-foreground" : "text-foreground/70 hover:bg-secondary"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            {/* Programmes pill for tablet */}
            <Link
              to="/programmes"
              className={`px-3 py-1 text-xs font-semibold rounded-full transition-all ${
                location.pathname.startsWith("/programmes") ? "bg-primary text-primary-foreground" : "text-foreground/70 hover:bg-secondary"
              }`}
            >
              Programmes
            </Link>
            {navLinks.slice(3).map((link) => {
              const isActive = location.pathname === link.href || (link.href !== "/" && location.pathname.startsWith(link.href));
              return (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`px-3 py-1 text-xs font-semibold rounded-full transition-all ${
                    isActive ? "bg-primary text-primary-foreground" : "text-foreground/70 hover:bg-secondary"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      {/* Spacer */}
      <div className="h-[60px] md:h-[112px] lg:h-[72px]" />

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-background flex flex-col pt-20 pb-8 px-6 lg:hidden overflow-y-auto"
          >
            <ul className="flex flex-col gap-1">
              {navLinks.slice(0, 3).map((link, i) => (
                <motion.li
                  key={link.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Link
                    to={link.href}
                    className="flex items-center justify-between text-foreground text-lg font-semibold py-3 px-4 rounded-lg hover:bg-secondary transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </Link>
                </motion.li>
              ))}

              {/* Programmes accordion */}
              <motion.li
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.12 }}
              >
                <button
                  id="mobile-programmes-toggle"
                  onClick={() => setProgrammesExpanded(!programmesExpanded)}
                  className="w-full flex items-center justify-between text-foreground text-lg font-semibold py-3 px-4 rounded-lg hover:bg-secondary transition-colors"
                >
                  Programmes
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${programmesExpanded ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {programmesExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden ml-4 mt-1 mb-1 border-l-2 border-primary/30 pl-4"
                    >
                      {programmeItems.map((item) => (
                        <Link
                          key={item.label}
                          to={item.href}
                          className="flex items-center gap-3 py-2.5 text-muted-foreground hover:text-foreground transition-colors"
                          onClick={() => { setMobileOpen(false); setProgrammesExpanded(false); }}
                        >
                          <item.icon className="w-4 h-4 text-primary flex-shrink-0" />
                          <div>
                            <p className="font-semibold text-sm text-foreground">{item.label}</p>
                            <p className="text-xs text-muted-foreground">{item.desc}</p>
                          </div>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.li>

              {navLinks.slice(3).map((link, i) => (
                <motion.li
                  key={link.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (i + 4) * 0.04 }}
                >
                  <Link
                    to={link.href}
                    className="flex items-center justify-between text-foreground text-lg font-semibold py-3 px-4 rounded-lg hover:bg-secondary transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </Link>
                </motion.li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-3 px-2">
              <Link
                to="/apply"
                className="flex justify-center items-center text-center bg-primary text-primary-foreground py-3 w-full rounded-lg text-base font-bold shadow-md shadow-primary/20"
                onClick={() => setMobileOpen(false)}
              >
                Join Today
              </Link>
              <a
                href="https://student.ragl-africa.org/membership/login"
                target="_blank"
                rel="noopener noreferrer"
                className="flex justify-center items-center text-center text-muted-foreground py-2 w-full text-xs font-semibold hover:text-primary transition-colors border-b border-border/50"
                onClick={() => setMobileOpen(false)}
              >
                Membership Portal Login
              </a>
              <a
                href="https://student.ragl-africa.org/library"
                target="_blank"
                rel="noopener noreferrer"
                className="flex justify-center items-center text-center text-muted-foreground py-2 w-full text-xs font-semibold hover:text-primary transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                Resource Centre
              </a>
            </div>

            <div className="mt-auto pt-6 text-center text-xs text-muted-foreground">
              © 2026 RAGLA
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
