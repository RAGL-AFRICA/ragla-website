import { useState } from "react";
import { User, Menu, X, ChevronRight } from "lucide-react";
import logo from "@/assets/ragla logo.png";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "HOME", href: "/" },
  { label: "ABOUT US", href: "/about-us" },
  { label: "MEMBERSHIP", href: "/membership-benefits" },
  { label: "GALLERY", href: "/gallery" },
  { label: "EVENTS", href: "/events" },
  { label: "NEWS", href: "/news" },
  { label: "POSTS", href: "/posts" },
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about-us" },
  { label: "Membership", href: "/membership-benefits" },
  { label: "Gallery", href: "/gallery" },
  { label: "Events", href: "/events" },
  { label: "News", href: "/news" },
  { label: "Posts", href: "/posts" },
  { label: "Contact Us", href: "/contact-us" },
      {/* Top bar */}
      <header className="bg-background py-4">
const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
            <img src={logo} alt="RAGLA Logo" className="h-14 w-auto" />
            <div className="hidden sm:block">
              <h1 className="text-foreground font-bold text-sm leading-tight">
      {/* Fixed Header Navbar */}
      <header className="fixed top-0 inset-x-0 z-50 bg-background/85 backdrop-blur-xl border-b border-border shadow-lg">
        <div className="container-main flex items-center justify-between px-4 md:px-6 py-3 md:py-4">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2 md:gap-3 flex-shrink-0">
            <img src={logo} alt="RAGLA Logo" className="h-10 md:h-14 w-auto drop-shadow-sm" />
            <div className="hidden sm:block">
              <h1 className="text-foreground font-black text-sm md:text-base leading-tight tracking-tight uppercase">
                Royal Academy
              </h1>
              <p className="text-primary text-[8px] md:text-[9px] font-bold uppercase tracking-widest">
                Governance & Leadership Africa
              </p>
            </a>
          </Link>
              href="/membership-benefits"
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center flex-1 justify-center px-6">
            <ul className="flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.href || (link.href !== '/' && location.pathname.startsWith(link.href));
                return (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className={`px-3 py-2 text-xs font-semibold tracking-wide transition-all duration-200 hover:text-primary relative group
                        ${isActive ? 'text-primary' : 'text-foreground/75'}
                      `}
                    >
                      {link.label}
                      <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-primary rounded-full transform origin-left transition-transform duration-300 ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3 flex-shrink-0">
            <Link to="/sign-in" className="flex items-center gap-1.5 text-foreground/75 hover:text-primary font-semibold text-xs transition-colors group">
              <div className="p-1 rounded-full bg-secondary group-hover:bg-primary/10 transition-colors">
                <User className="w-3.5 h-3.5" />
              </div>
              <span className="hidden lg:inline">Login</span>
            </Link>
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
            {navLinks.map((link) => (
                <a
        {/* Tablet Navigation (md to lg) */}
        <div className="hidden md:flex lg:hidden border-t border-border/50">
                >
                </a>
                const isActive = location.pathname === link.href || (link.href !== '/' && location.pathname.startsWith(link.href));
              </li>
                  <Link
                    key={link.label}
        </div>
                      className={`px-3 py-1 text-xs font-semibold rounded-full transition-all ${
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'text-foreground/70 hover:bg-secondary'
                      }`}

      {/* Mobile menu */}
                    </Link>
          <button
            className="absolute top-4 right-4 text-foreground"
          >
        </div>
      </header>
          </button>
      {/* Spacer to prevent content from jumping due to fixed header */}
      <div className="h-16 md:h-20"></div>

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
                </a>
              </li>
                <motion.li 
                  key={link.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 }}
                >
                  <Link
              <a href="/sign-in" className="flex items-center gap-2 text-primary text-lg font-semibold">
                      className="flex items-center justify-between text-foreground text-lg font-semibold py-3 px-4 rounded-lg hover:bg-secondary transition-colors"
                Login
              </a>
            </li>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </Link>
                </motion.li>
      )}
    </>

            <div className="mt-8 flex flex-col gap-3 px-2">
              <Link 
                to="/sign-in" 
                className="flex justify-center items-center gap-2 py-3 w-full border border-border rounded-lg text-base font-bold transition-colors hover:bg-secondary"
                onClick={() => setMobileOpen(false)}
              >
                <User className="w-4 h-4 text-primary" />
                Login
              </Link>
              <Link
                to="/apply"
                className="flex justify-center items-center text-center bg-primary text-primary-foreground py-3 w-full rounded-lg text-base font-bold shadow-md shadow-primary/20"
                onClick={() => setMobileOpen(false)}
              >
                Join Today
              </Link>
            </div>
            
            <div className="mt-auto pt-6 text-center text-xs text-muted-foreground">
              © 2026 RAGLA
            </div>
          </motion.div>
        )}
      </AnimatePresence>
