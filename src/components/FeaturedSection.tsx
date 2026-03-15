import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const FeaturedSection = () => {
  return (
    <section className="section-padding bg-background">
      <div className="container-main">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Featured Image/Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl p-12 min-h-96 flex items-center justify-center"
          >
            <div className="text-center">
              <div className="text-6xl font-black text-primary mb-4">👔</div>
              <p className="text-muted-foreground text-sm">Featured Event Showcase</p>
            </div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-3">
              Featured Achievement
            </p>
            <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
              Induction of Dr. Francis Omane-Addo
            </h3>
            <p className="text-lg md:text-xl text-primary font-semibold mb-6">
              Deputy Director-General of Ghana Prisons Service as a Distinguished Fellow
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              RAGLA continues to recognize and honor outstanding leaders in governance and institutional management. Dr. Francis Omane-Addo's induction as a Distinguished Fellow represents our commitment to fostering excellence and leadership integrity across the African continent.
            </p>

            <div className="flex flex-col gap-4">
              <a
                href="/gallery"
                className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 px-8 rounded-lg font-semibold hover:brightness-110 transition-all duration-200 uppercase tracking-wider text-sm w-full md:w-auto"
              >
                View Gallery
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="/about-us"
                className="inline-flex items-center justify-center gap-2 border border-primary text-primary py-3 px-8 rounded-lg font-semibold hover:bg-primary hover:text-primary-foreground transition-all duration-200 uppercase tracking-wider text-sm"
              >
                Learn More
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;
