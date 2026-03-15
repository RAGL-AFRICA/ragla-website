import { motion } from "framer-motion";
import { Award, BookOpen } from "lucide-react";

const AboutSection = () => {
  return (
    <section id="about" className="section-padding bg-dark-surface">
      <div className="container-main">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Left: Mission */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-3">
              About Us
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Our Mission
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Our Mission is built on five thematic areas: Professional Excellence, Capacity
              Building, Market Driven Research, Fostering Strong Partnership, and Nurturing the
              Next Generation of African Leaders.
            </p>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-foreground font-semibold mb-1">Professional Excellence</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    We are committed to fostering professional excellence, ethical integrity, and
                    accountability in our service delivery.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-foreground font-semibold mb-1">Capacity Building</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    We are dedicated to developing the capacity of leaders through our courses and
                    programmes, and CPD initiatives.
                  </p>
                </div>
              </div>
            </div>

            <a
              href="#"
              className="inline-block mt-8 border border-primary text-primary py-3 px-8 rounded-lg font-semibold hover:bg-primary hover:text-primary-foreground transition-all duration-200 uppercase tracking-wider text-sm"
            >
              More About Us
            </a>
          </motion.div>

          {/* Right: Stat */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex items-center justify-center"
          >
            <div className="text-center">
              <span className="text-8xl md:text-9xl font-black text-primary tabular-nums">1+</span>
              <h3 className="text-2xl font-bold text-foreground mt-2">YEARS OF</h3>
              <p className="text-muted-foreground text-lg uppercase tracking-wider">
                Academic Leadership
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
