import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-[70vh] md:min-h-[80vh] flex items-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt="RAGLA Leadership"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-background/70" />
      </div>

      <div className="container-main relative z-10 grid md:grid-cols-2 gap-8 md:gap-12 items-center py-16 md:py-24">
        {/* Left: headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-primary text-sm font-medium tracking-widest uppercase mb-4 gold-underline inline-block">
            Servitium Integritas Phasellus
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mt-6">
            Top-notch Pan-African Governance and Leadership Academy
          </h1>
        </motion.div>

        {/* Right: description + CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col gap-6"
        >
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
            The Royal Academy of Governance and Leadership Africa (RAGLA) is dedicated to
            fostering the highest standards of excellence in governance and leadership in Africa.
          </p>
          <div className="flex flex-col gap-3">
            <a
              href="#membership"
              className="border border-primary text-primary text-center py-3 px-8 rounded-lg font-semibold hover:bg-primary hover:text-primary-foreground transition-all duration-200 uppercase tracking-wider text-sm"
            >
              Become a Member
            </a>
            <a
              href="#about"
              className="border border-primary text-primary text-center py-3 px-8 rounded-lg font-semibold hover:bg-primary hover:text-primary-foreground transition-all duration-200 uppercase tracking-wider text-sm"
            >
              More About RAGLA
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
