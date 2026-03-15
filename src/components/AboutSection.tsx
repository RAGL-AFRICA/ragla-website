import { motion } from "framer-motion";
import { Award, BookOpen, BarChart3, Handshake, Lightbulb } from "lucide-react";

const pillars = [
  {
    icon: Award,
    title: "Professional Excellence",
    description: "We are committed to fostering professional excellence, ethical integrity, and accountability in our service delivery."
  },
  {
    icon: BookOpen,
    title: "Capacity Building",
    description: "We are dedicated to developing the capacity of leaders through our courses and programmes, and CPD initiatives."
  },
  {
    icon: BarChart3,
    title: "Market Driven Research",
    description: "Conducting research that addresses real-world governance and leadership challenges in Africa."
  },
  {
    icon: Handshake,
    title: "Fostering Strong Partnership",
    description: "Building strategic partnerships to amplify impact and create sustainable governance solutions."
  },
  {
    icon: Lightbulb,
    title: "Nurturing Next Generation",
    description: "Developing and mentoring the next generation of African leaders and governance professionals."
  }
];

const AboutSection = () => {
  return (
    <section id="about" className="section-padding bg-dark-surface">
      <div className="container-main">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-3">
            About Us
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Our Mission
          </h2>
          <p className="text-muted-foreground leading-relaxed max-w-3xl mx-auto mb-8">
            Our Mission is built on five thematic areas: Professional Excellence, Capacity
            Building, Market Driven Research, Fostering Strong Partnership, and Nurturing the
            Next Generation of African Leaders.
          </p>
        </motion.div>

        {/* Five Pillars Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          {pillars.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="bg-background rounded-lg p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-foreground font-semibold mb-3 text-sm">{pillar.title}</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  {pillar.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* CTA and Stats */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <a
              href="/about-us"
              className="inline-block border border-primary text-primary py-3 px-8 rounded-lg font-semibold hover:bg-primary hover:text-primary-foreground transition-all duration-200 uppercase tracking-wider text-sm"
            >
              More About Us
            </a>
          </motion.div>

          {/* Right: Stat */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex items-center justify-center md:justify-end"
          >
            <div className="text-center">
              <span className="text-8xl md:text-9xl font-black text-primary tabular-nums">20+</span>
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
