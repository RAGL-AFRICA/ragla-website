import { useState } from "react";
import { Search, User, Menu, X } from "lucide-react";
import logo from "@/assets/ragla-logo.png";

const navLinks = [
  { label: "HOME", href: "#" },
  { label: "ABOUT US", href: "#about" },
  { label: "MEMBERSHIP", href: "#membership" },
  { label: "CONTACT US", href: "#contact" },
  { label: "GALLERY", href: "#gallery" },
  { label: "UPCOMING", href: "#upcoming" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Top bar */}
      <header className="bg-background py-4">
        <div className="container-main flex items-center justify-between">
          <a href="#" className="flex items-center gap-3">
            <img src={logo} alt="RAGLA Logo" className="h-16 w-auto" />
          </a>

          <div className="flex items-center gap-6">
            <a href="#" className="hidden md:flex items-center gap-2 text-foreground hover:text-primary transition-colors text-sm">
              <User className="w-4 h-4" />
              Login
            </a>
            <a
              href="#membership"
              className="hidden md:inline-flex bg-primary text-primary-foreground px-6 py-2.5 rounded-full text-sm font-semibold hover:brightness-110 transition-all duration-200"
            >
              Join today
            </a>
            <button className="hidden md:block text-foreground hover:text-primary transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button
              className="md:hidden text-foreground"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Navigation bar */}
      <nav className="bg-nav sticky top-0 z-50 rounded-xl mx-2 md:mx-4">
        <div className="container-main">
          <ul className="hidden md:flex items-center justify-center gap-8 py-4">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-nav-foreground text-sm font-semibold tracking-wide hover:opacity-70 transition-opacity duration-200"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-secondary fixed inset-x-0 top-0 z-50 p-6 pt-20">
          <button
            className="absolute top-4 right-4 text-foreground"
            onClick={() => setMobileOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
          <ul className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-foreground text-lg font-semibold block py-2"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="pt-4">
              <a href="#" className="flex items-center gap-2 text-primary text-lg font-semibold">
                <User className="w-5 h-5" />
                Login
              </a>
            </li>
          </ul>
        </div>
      )}
    </>
  );
};

export default Header;
