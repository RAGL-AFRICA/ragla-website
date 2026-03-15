import { motion } from "framer-motion";
import upcomingImg from "@/assets/upcoming-event.jpg";

const UpcomingSection = () => {
  return (
    <section id="upcoming" className="section-padding bg-background">
      <div className="container-main grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Upcoming...
          </h2>
          <p className="text-primary text-lg font-semibold mb-2">
            Special guest speaker series II
          </p>
          <p className="text-muted-foreground">28th March, 2026</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-2xl overflow-hidden card-shadow"
        >
          <img
            src={upcomingImg}
            alt="Upcoming guest speaker event"
            className="w-full h-72 md:h-96 object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default UpcomingSection;
