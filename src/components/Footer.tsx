import { Facebook, Twitter, Instagram, MessageCircle, MapPin, Phone, Mail } from "lucide-react";
import logo from "@/assets/ragla logo.png";

const Footer = () => {
  return (
    <footer className="bg-dark-surface border-t border-border">
      {/* CTA Banner */}
      <div className="bg-primary py-8">
        <div className="container-main flex flex-col md:flex-row items-center justify-between gap-4">
          <h3 className="text-primary-foreground text-xl md:text-2xl font-bold">
            Ready To Join? Start Your Membership Journey..
          </h3>
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSdk8sP-RagcTtUhWOMolVX7unaXpBOfdF0c4fiPhuWAE45UcA/viewform?usp=header"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary-foreground text-primary py-3 px-8 rounded-lg font-bold hover:opacity-90 transition-opacity uppercase tracking-wider text-sm"
          >
            Join Now
          </a>
        </div>
      </div>

      <div className="container-main py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo + tagline */}
          <div className="md:col-span-1">
            <div className="flex items-start gap-3 mb-4">
              <img src={logo} alt="RAGLA Logo" className="h-16 w-auto flex-shrink-0" />
              <div>
                <h3 className="text-foreground font-black text-lg leading-tight tracking-tight">
                  ROYAL ACADEMY
                </h3>
                <p className="text-primary text-xs font-bold uppercase tracking-widest mt-1">
                  Of Governance & Leadership Africa
                </p>
              </div>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Top-notch Pan-African Governance and Leadership Academy
            </p>
            <div className="flex gap-3 mt-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-foreground font-semibold mb-4">Quick links</h4>
            <ul className="space-y-2">
              <li><a href="#about" className="text-muted-foreground text-sm hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#contact" className="text-muted-foreground text-sm hover:text-primary transition-colors">Contact Us</a></li>
              <li><a href="#membership" className="text-muted-foreground text-sm hover:text-primary transition-colors">Membership</a></li>
            </ul>
          </div>

          {/* Phone & Email */}
          <div>
            <h4 className="text-foreground font-semibold mb-4">Phone & Email</h4>
            <ul className="space-y-3">
              <li className="flex gap-2 items-start">
                <Phone className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground text-sm">+233 (0)256257507</span>
              </li>
              <li className="flex gap-2 items-start">
                <Mail className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground text-sm">Info@ragl-africa.org</span>
              </li>
            </ul>
          </div>

          {/* Address */}
          <div>
            <h4 className="text-foreground font-semibold mb-4">Address</h4>
            <div className="flex gap-2 items-start">
              <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-muted-foreground text-sm">
                GA – 334 – 8177 2nd Bissau Street, East Legon, Accra – Ghana
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="container-main py-4 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-muted-foreground text-xs">
            Copyright © 2026 <span className="font-semibold text-foreground">RAGLA.</span>
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-muted-foreground text-xs hover:text-primary transition-colors">FAQs</a>
            <a href="#" className="text-muted-foreground text-xs hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="text-muted-foreground text-xs hover:text-primary transition-colors">Terms & Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
