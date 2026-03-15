import { motion } from "framer-motion";

const categories = [
  { code: "FM-RAGLA", title: "Foundational Member (FM-RAGLA)", members: "55+" },
  { code: "AFF-RAGLA", title: "Affiliate Member (AFF-RAGLA)", members: "70+" },
  { code: "ASSOC-RAGLA", title: "Associate Member (Assoc-RAGLA)", members: "38+" },
  { code: "CertM-RAGLA", title: "Certified Member (CertM-RAGLA)", members: "55+" },
  { code: "ChM-RAGLA", title: "Chartered Member (ChM-RAGLA)", members: "70+" },
  { code: "F-RAGLA", title: "Fellow Member (F-RAGLA)", members: "38+" },
];

const MembershipSection = () => {
  return (
    <section id="membership" className="section-padding bg-background">
      <div className="container-main">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-3">
            Membership
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Membership Categories & Criteria
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.code}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="membership-card text-center"
            >
              <h3 className="text-primary text-lg font-bold mb-2">{cat.code}</h3>
              <h4 className="text-foreground font-semibold mb-4">{cat.title}</h4>
              <p className="text-muted-foreground text-sm mb-6">{cat.members} Members</p>
              <a
                href="#"
                className="inline-block border border-primary text-primary py-2 px-6 rounded-lg text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-all duration-200 uppercase tracking-wider"
              >
                Criteria & Benefits
              </a>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-12"
        >
          <a
            href="#"
            className="inline-block bg-primary text-primary-foreground py-3 px-10 rounded-lg font-bold hover:brightness-110 transition-all duration-200 uppercase tracking-wider text-sm"
          >
            Join Us Now
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default MembershipSection;
