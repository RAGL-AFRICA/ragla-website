import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-[70vh] md:min-h-[80vh] flex items-center overflow-hidden">
      {/* Background image & gradient overlay */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt="RAGLA Leadership"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/40" />
      </div>

      <div className="container-main relative z-10 grid md:grid-cols-2 gap-8 md:gap-12 items-center py-16 md:py-24">
        {/* Left: headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-widest uppercase mb-6">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Servitium Integritas Phasellus
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-[4rem] font-black text-foreground leading-[1.1] tracking-tight">
            Top-notch Pan-African <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#FFD700]">Governance</span> & Leadership
          </h1>
        </motion.div>

        {/* Right: description + CTAs */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="flex flex-col gap-8 md:pl-10 lg:pl-16 border-l-0 md:border-l border-border/50"
        >
          <p className="text-muted-foreground text-lg md:text-xl leading-relaxed font-medium">
            The <strong className="text-foreground">Royal Academy of Governance and Leadership Africa (RAGLA)</strong> is dedicated to fostering the highest standards of excellence across the continent.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/apply"
              className="bg-primary text-primary-foreground text-center py-4 px-8 rounded-xl font-bold shadow-lg shadow-primary/20 hover:-translate-y-1 hover:shadow-primary/40 transition-all duration-300 uppercase tracking-wider text-sm flex-1"
            >
              Apply for Membership
            </Link>
            <Link
              to="/about-us"
              className="bg-secondary text-foreground border border-border text-center py-4 px-8 rounded-xl font-bold hover:bg-secondary/80 hover:-translate-y-1 transition-all duration-300 uppercase tracking-wider text-sm flex-1"
            >
              Discover RAGLA
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
