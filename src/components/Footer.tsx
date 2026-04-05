import { Facebook, Twitter, Instagram, MessageCircle, MapPin, Phone, Mail, ChevronRight } from "lucide-react";
import logo from "@/assets/ragla logo.png";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-secondary/40 border-t border-border mt-auto">
      
      {/* CTA Banner */}
      <div className="bg-primary relative overflow-hidden">
        {/* Subtle pattern or gradient overlay could go here */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-transparent pointer-events-none" />
        
        <div className="container-main relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 py-10 md:py-12">
          <div className="max-w-xl text-center md:text-left">
             <h3 className="text-primary-foreground text-2xl md:text-3xl font-black mb-2">
              Ready To Join? Start Your Journey..
            </h3>
            <p className="text-primary-foreground/80 font-medium">
              Join a pan-african network of excellence in governance.
            </p>
          </div>
          
          <Link
            to="/apply"
            className="group flex items-center gap-2 bg-primary-foreground text-primary py-4 px-10 rounded-xl font-bold hover:shadow-xl hover:shadow-black/20 hover:-translate-y-1 transition-all uppercase tracking-wider text-sm whitespace-nowrap"
          >
            Apply for Membership
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      <div className="container-main py-16 md:py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          
          {/* Brand Column */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <Link to="/" className="flex items-center gap-4 inline-block">
              <img src={logo} alt="RAGLA Logo" className="h-20 w-auto flex-shrink-0 drop-shadow-md bg-white p-2 rounded-xl" />
              <div>
                <h3 className="text-foreground font-black text-xl leading-tight tracking-tight">
                  ROYAL ACADEMY
                </h3>
                <p className="text-primary text-[10px] font-bold uppercase tracking-widest mt-1">
                  Of Governance & Leadership Africa
                </p>
              </div>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
              Dedicated to fostering the highest standards of excellence in governance and leadership across the African continent. Let's build a brighter future.
            </p>
            <div className="flex gap-4 mt-2">
              <a href="#" className="w-10 h-10 rounded-full bg-background flex items-center justify-center border border-border text-muted-foreground hover:text-primary hover:border-primary transition-all shadow-sm hover:shadow-primary/20">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-background flex items-center justify-center border border-border text-muted-foreground hover:text-primary hover:border-primary transition-all shadow-sm hover:shadow-primary/20">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-background flex items-center justify-center border border-border text-muted-foreground hover:text-primary hover:border-primary transition-all shadow-sm hover:shadow-primary/20">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-background flex items-center justify-center border border-border text-muted-foreground hover:text-primary hover:border-primary transition-all shadow-sm hover:shadow-primary/20">
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links Column */}
          <div className="lg:col-span-2 lg:col-start-6">
            <h4 className="text-foreground font-bold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-4">
              <li><Link to="/about-us" className="text-muted-foreground text-sm font-medium hover:text-primary transition-colors flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary/50" /> About Us</Link></li>
              <li><Link to="/contact-us" className="text-muted-foreground text-sm font-medium hover:text-primary transition-colors flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary/50" /> Contact Us</Link></li>
              <li><Link to="/membership-benefits" className="text-muted-foreground text-sm font-medium hover:text-primary transition-colors flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary/50" /> Membership</Link></li>
              <li><Link to="/gallery" className="text-muted-foreground text-sm font-medium hover:text-primary transition-colors flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary/50" /> Gallery</Link></li>
              <li><a href="https://student.ragl-africa.org/student/login" target="_blank" rel="noopener noreferrer" className="text-muted-foreground text-sm font-medium hover:text-primary transition-colors flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-yellow-500" /> Student Portal</a></li>
              <li><a href="https://student.ragl-africa.org/library" target="_blank" rel="noopener noreferrer" className="text-muted-foreground text-sm font-medium hover:text-primary transition-colors flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Digital Library</a></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="lg:col-span-4 lg:col-start-9">
            <h4 className="text-foreground font-bold text-lg mb-6">Get In Touch</h4>
            <ul className="space-y-5">
              <li className="flex gap-4 items-start group">
                <div className="p-2.5 rounded-lg bg-background border border-border group-hover:border-primary/50 transition-colors flex-shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div className="pt-1">
                  <p className="text-sm font-bold text-foreground mb-1">Office Location</p>
                  <p className="text-muted-foreground text-sm leading-relaxed">GA – 334 – 8177 2nd Bissau Street,<br /> East Legon, Accra – Ghana</p>
                </div>
              </li>
              
              <li className="flex gap-4 items-start group">
                <div className="p-2.5 rounded-lg bg-background border border-border group-hover:border-primary/50 transition-colors flex-shrink-0">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div className="pt-1">
                  <p className="text-sm font-bold text-foreground mb-1">Phone Number</p>
                  <p className="text-muted-foreground text-sm">+233 (0)256257507</p>
                </div>
              </li>
              
              <li className="flex gap-4 items-start group">
                 <div className="p-2.5 rounded-lg bg-background border border-border group-hover:border-primary/50 transition-colors flex-shrink-0">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div className="pt-1">
                  <p className="text-sm font-bold text-foreground mb-1">Email Address</p>
                  <a href="mailto:Info@ragl-africa.org" className="text-muted-foreground text-sm hover:text-primary transition-colors">Info@ragl-africa.org</a>
                </div>
              </li>
            </ul>
          </div>
          
        </div>
      </div>

      {/* Bottom Legal Bar */}
      <div className="border-t border-border bg-background">
        <div className="container-main py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-xs font-medium">
            Copyright © {new Date().getFullYear()} <span className="font-bold text-foreground tracking-wider">RAGLA.</span> All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link to="#" className="text-muted-foreground text-xs font-medium hover:text-primary transition-colors">FAQs</Link>
            <Link to="#" className="text-muted-foreground text-xs font-medium hover:text-primary transition-colors">Privacy Policy</Link>
            <Link to="#" className="text-muted-foreground text-xs font-medium hover:text-primary transition-colors">Terms & Conditions</Link>
          </div>
        </div>
      </div>
      
    </footer>
  );
};

export default Footer;
