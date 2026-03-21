import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const membershipCategories = [
  {
    code: "FM-RAGLA",
    title: "Foundational Member (FM-RAGLA)",
    criteria: [
      "Members who pioneered, shared, and promoted the concept and founding ideals of the Institute.",
      "Must be in good academic and professional standing.",
      "Must be Middle to Top-Level Executive.",
      "Willing to undertake Continuous Professional Development (CPD).",
      "Committed to honouring financial obligations to the Academy within stipulated time frame.",
    ],
  },
  {
    code: "AFF-RAGLA",
    title: "Affiliate Member (AFF-RAGLA)",
    criteria: [
      "Lower to Middle-Level Executive.",
      "Must have at least a Degree or Professional Diploma in a related area.",
      "Must have 3-5 years working experience.",
      "Must be ready to conform to the norms, values, and established order of the Academy.",
      "Must be ready to pay the appropriate Membership dues.",
      "Must be ready to undertake CPD as a pre-requisite.",
    ],
  },
  {
    code: "CertM-RAGLA",
    title: "Certified Member (CertM-RAGLA)",
    criteria: [
      "Must have a minimum of a Bachelor's degree or its equivalent professional qualification.",
      "Must have completed one of the Certified Programmes run by the Academy.",
      "Must have at least five (5) years of relevant professional experience.",
      "Must subscribe to and uphold the Code of Ethics and Professional Standards of the Academy.",
      "Complete a minimum of 40 CPD hours annually.",
    ],
  },
  {
    code: "ASSOC-RAGLA",
    title: "Associate Member (Assoc-RAGLA)",
    criteria: [
      "Must have at least a Degree or Professional Qualification in a relevant area of study.",
      "Must be a Middle-Top Management Executive.",
      "Must have 5-10 years working experience in a related area.",
      "Must be ready to conform to the values and established order of the Academy.",
      "Must be ready to pay the appropriate Membership dues.",
      "Must be ready to undertake CPD.",
    ],
  },
  {
    code: "ChM-RAGLA",
    title: "Chartered Member (ChM-RAGLA)",
    criteria: [
      "Designed for those Professionals who want to pursue the highest professional qualification in GLRC.",
      "Must have a recognized Post-Graduate degree or higher in relevant fields.",
      "Must have a minimum of 10 years of progressive leadership or governance experience.",
      "Proven record of executive leadership or board participation.",
      "Must be a Scholar-Practitioner with evidence of thought leadership.",
      "Must have completed Chartered Professional Programme of the Academy.",
    ],
  },
  {
    code: "F-RAGLA",
    title: "Fellow Member (F-RAGLA)",
    criteria: [
      "The highest Membership category — Members are inducted into a Council of Fellows.",
      "Must have at least a minimum of Post-Graduate Qualification.",
      "Must have a minimum of 15-30 years unimpeded working experience.",
      "Must be an accomplished senior corporate executive, seasoned public servant, or renowned academic.",
    ],
  },
];

const membershipBenefits = [
  {
    title: "Professional Recognition",
    items: [
      "Obtain designations and certifications demonstrating credibility and competence.",
      "Attain recognition as a trusted governance and leadership professional.",
      "Assigned appropriate post-nominal letters to signify professional standing.",
    ],
  },
  {
    title: "Networking Opportunities",
    items: [
      "Access to a network of governance and leadership practitioners across Africa and the globe.",
      "Opportunities to link with senior executives, directors, board members, and policymakers.",
      "Participate in regional and continental leadership summits and conferences.",
    ],
  },
  {
    title: "Capacity Building & Continuous Learning",
    items: [
      "Free or discounted access to executive training and CPD programmes.",
      "Privileged access to market driven research, case studies, and global best practices.",
      "Opportunity to gain CPD points to maintain professional status.",
    ],
  },
  {
    title: "Knowledge Resources",
    items: [
      "Subscribe to journals, newsletters, and research reports on governance and leadership.",
      "Access to a digital resource library with templates, frameworks, and policies.",
      "Periodic briefs on policy and thought leadership publications.",
    ],
  },
  {
    title: "Career Advancement",
    items: [
      "Participate in career programmes through mentorship, executive coaching, and leadership development.",
      "Access to privileged announcements of directors and leadership positions.",
      "Recognition awards celebrating remarkable contributions in governance and leadership.",
    ],
  },
  {
    title: "Advocacy & Influence",
    items: [
      "Be part of a collective voice shaping governance and policy reforms across Africa.",
      "Representation in high-level dialogues with governments and regional bodies.",
      "Opportunity to serve on committees, councils, or advisory boards of the Academy.",
    ],
  },
  {
    title: "Discounts & Special Privileges",
    items: [
      "Discounted rates for certification exams, publications, events, and professional services.",
      "Partner benefits including discounts on executive education.",
      "Privileged invitations to governance roundtables and leadership retreats.",
    ],
  },
  {
    title: "Community & Social Impact",
    items: [
      "Participate in initiatives promoting principled leadership and accountability in Africa.",
      "Engage in corporate social responsibility (CSR) projects.",
      "Recognition for contributing to promoting good governance practices.",
    ],
  },
];

const MembershipBenefits = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Page Header */}
      <section className="section-padding bg-secondary">
        <div className="container-main text-center">
          <p className="text-xs font-semibold tracking-widest text-primary uppercase mb-3">MEMBERSHIP</p>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">Membership Categories & Criteria</h1>
        </div>
      </section>

      {/* Categories */}
      <section className="section-padding">
        <div className="container-main grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {membershipCategories.map((cat) => (
            <div key={cat.code} className="membership-card flex flex-col">
              <p className="text-primary font-bold text-sm tracking-wider mb-1">{cat.code}</p>
              <h3 className="text-foreground font-bold text-xl mb-4">{cat.title}</h3>
              <ul className="space-y-3 flex-1">
                {cat.criteria.map((c, i) => (
                  <li key={i} className="flex gap-2 items-start text-muted-foreground text-sm">
                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
              <Link to="/apply" className="mt-6 block text-center bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:brightness-110 transition-all text-sm">
                Join Now
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="section-padding bg-secondary">
        <div className="container-main">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-10 text-center">Membership Benefits</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {membershipBenefits.map((benefit) => (
              <div key={benefit.title} className="bg-card rounded-xl p-6 card-shadow">
                <h3 className="text-primary font-semibold text-lg mb-4">{benefit.title}</h3>
                <ul className="space-y-2">
                  {benefit.items.map((item, i) => (
                    <li key={i} className="flex gap-2 items-start text-muted-foreground text-sm">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/apply" className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-semibold hover:brightness-110 transition-all uppercase tracking-wider text-sm">
              Join Our Membership
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MembershipBenefits;
