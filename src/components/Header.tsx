import { useState } from "react";
import { Search, User, Menu, X, ChevronRight } from "lucide-react";
import logo from "@/assets/ragla logo.png";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about-us" },
  { label: "Membership", href: "/membership-benefits" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact Us", href: "/contact-us" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* Unified Sticky Navbar */}
      <header className="fixed top-0 inset-x-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border shadow-sm">
        <div className="container-main flex items-center justify-between h-20 md:h-24">
          
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
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            <ul className="flex items-center gap-6 lg:gap-8">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.href || (link.href !== '/' && location.pathname.startsWith(link.href));
                return (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className={`text-sm font-semibold tracking-wide transition-all duration-200 hover:text-primary relative group py-2
                        ${isActive ? 'text-primary' : 'text-foreground/80'}
                      `}
                    >
                      {link.label}
                      <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-primary rounded-full transform origin-left transition-transform duration-300 ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="flex items-center gap-4 pl-4 lg:pl-6 border-l border-border mt-1">
              <Link to="/sign-in" className="flex items-center gap-2 text-foreground/80 hover:text-primary font-semibold text-sm transition-colors group">
                <div className="p-1.5 rounded-full bg-secondary group-hover:bg-primary/10 transition-colors">
                   <User className="w-4 h-4" />
                </div>
                <span>Login</span>
              </Link>
              <Link
                to="/apply"
                className="bg-primary text-primary-foreground px-6 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300"
              >
                Join Today
              </Link>
            </div>
          </nav>

          {/* Mobile Toggle Button */}
          <button
            className="md:hidden text-foreground p-2 z-50 rounded-full hover:bg-secondary transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Spacer to prevent content from jumping due to fixed header */}
      <div className="h-20 md:h-24"></div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-background flex flex-col pt-24 pb-8 px-6 md:hidden overflow-y-auto"
          >
            <ul className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <motion.li 
                  key={link.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Link
                    to={link.href}
                    className="flex items-center justify-between text-foreground text-xl font-bold py-4 border-b border-border/50"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </Link>
                </motion.li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-4 px-2">
              <Link 
                to="/sign-in" 
                className="flex justify-center items-center gap-3 py-4 w-full border border-border rounded-xl text-lg font-bold"
                onClick={() => setMobileOpen(false)}
              >
                <User className="w-5 h-5 text-primary" />
                Admin / Member Login
              </Link>
              <Link
                to="/apply"
                className="flex justify-center items-center text-center bg-primary text-primary-foreground py-4 w-full rounded-xl text-lg font-bold shadow-lg shadow-primary/20"
                onClick={() => setMobileOpen(false)}
              >
                Apply for Membership
              </Link>
            </div>
            
            <div className="mt-auto pt-8 text-center text-xs text-muted-foreground">
              © 2026 Royal Academy of Governance & Leadership Africa
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
